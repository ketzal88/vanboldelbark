/* Proxy de leads: las landings postean acá y este endpoint reenvía a GHL.
   La URL del webhook vive solo en la env var GHL_WEBHOOK_URL (Vercel). */

const MAX_BODY = 8 * 1024;
const VENTANA_MS = 10 * 60 * 1000;
const MAX_POR_VENTANA = 5;

/* shortcut: rate limit en memoria por instancia (se reinicia en cold start y no se
   comparte entre instancias), alcanza para frenar un bot simple; si hace falta algo
   firme, pasar a Vercel Firewall o Upstash. */
const hits = new Map();

function limitado(ip) {
  const ahora = Date.now();
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (ahora - v.t0 > VENTANA_MS) hits.delete(k);
  }
  const h = hits.get(ip);
  if (!h || ahora - h.t0 > VENTANA_MS) {
    hits.set(ip, { t0: ahora, n: 1 });
    return false;
  }
  h.n += 1;
  return h.n > MAX_POR_VENTANA;
}

const str = (v, max) => typeof v === "string" && v.length <= max;
const TAG_RE = /^[\p{L}\p{N}:_ -]{1,60}$/u;

/* Devuelve el payload limpio (solo campos conocidos) o null si es inválido. */
function sanear(b) {
  if (!b || typeof b !== "object" || Array.isArray(b)) return null;
  if (!str(b.firstName, 120) || b.firstName.trim().length < 1) return null;
  /* Hace falta al menos un medio de contacto válido: teléfono o mail */
  const tel = b.phone === undefined ? "" : b.phone;
  const mail = b.email === undefined ? "" : b.email;
  if (!str(tel, 40) || !str(mail, 200)) return null;
  const digitos = tel.replace(/\D/g, "").length;
  if (tel !== "" && (digitos < 8 || digitos > 20)) return null; // normalizarCelular agrega +549
  if (mail !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) return null;
  if (tel === "" && mail === "") return null;
  if (b.lastName !== undefined && !str(b.lastName, 120)) return null;
  if (!Array.isArray(b.tags) || b.tags.length < 1 || b.tags.length > 10) return null;
  if (!b.tags.every((t) => typeof t === "string" && TAG_RE.test(t))) return null;
  if (!str(b.source, 80)) return null;

  const cf = b.customField === undefined ? {} : b.customField;
  if (!cf || typeof cf !== "object" || Array.isArray(cf)) return null;
  const claves = Object.keys(cf);
  if (claves.length > 40) return null;
  const customField = {};
  for (const k of claves) {
    const v = cf[k];
    if (!/^[A-Za-z0-9_]{1,50}$/.test(k)) return null;
    if (typeof v === "number" && Number.isFinite(v)) customField[k] = v;
    else if (str(v, 600)) customField[k] = v;
    else return null;
  }

  const out = { firstName: b.firstName.trim(), tags: b.tags, source: b.source, customField };
  if (b.lastName) out.lastName = b.lastName.trim();
  if (tel) out.phone = tel.trim();
  if (mail) out.email = mail.trim();
  return out;
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ ok: false });

  /* Solo desde nuestras propias páginas (cada dominio espejo se sirve desde este deploy). */
  const origin = req.headers.origin;
  if (origin) {
    let host = "";
    try { host = new URL(origin).host; } catch (e) { /* origin inválido */ }
    if (host !== req.headers.host) return res.status(403).json({ ok: false });
  }

  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "desconocida";
  if (limitado(ip)) return res.status(429).json({ ok: false });

  let body = req.body;
  if (typeof body === "string") {
    if (body.length > MAX_BODY) return res.status(413).json({ ok: false });
    try { body = JSON.parse(body); } catch (e) { return res.status(400).json({ ok: false }); }
  }
  if (body && typeof body === "object" && JSON.stringify(body).length > MAX_BODY) {
    return res.status(413).json({ ok: false });
  }

  /* Honeypot: un humano no ve el campo. Respondemos ok para que el bot no reintente. */
  if (body && typeof body.hp === "string" && body.hp !== "") return res.status(200).json({ ok: true });

  const limpio = sanear(body);
  if (!limpio) return res.status(400).json({ ok: false });

  const url = process.env.GHL_WEBHOOK_URL;
  if (!url) return res.status(500).json({ ok: false });

  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(limpio),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return res.status(502).json({ ok: false });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ ok: false });
  }
};

module.exports.sanear = sanear;
