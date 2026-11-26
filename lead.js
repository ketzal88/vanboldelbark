/* Cliente de captación compartido por todas las landings.
   Posta a /api/lead (que reenvía a GHL), con timeout, un reintento y cola local
   si GHL no responde. enviar() resuelve true solo si el lead quedó entregado. */
(function (w) {
  var ENDPOINT = "/api/lead";
  var COLA = "lead_cola";
  var TIMEOUT_MS = 8000;

  /* Honeypot: campo que un humano no ve. Nombre raro para que el autofill no lo toque. */
  var hp = null;
  function montarHoneypot() {
    hp = document.createElement("input");
    hp.type = "text";
    hp.name = "contact_extra";
    hp.tabIndex = -1;
    hp.autocomplete = "off";
    hp.setAttribute("aria-hidden", "true");
    hp.style.cssText = "position:absolute;left:-9999px;width:1px;height:1px;opacity:0";
    document.body.appendChild(hp);
  }
  if (document.body) montarHoneypot();
  else document.addEventListener("DOMContentLoaded", montarHoneypot);

  function digitos(v) {
    return String(v).replace(/\D/g, "");
  }

  /* E.164 conservador: si no encaja en un patrón conocido, se deja como vino. */
  function normalizarCelular(valor) {
    var d = digitos(valor);
    if (d.indexOf("54") === 0) d = d.slice(2);
    if (d.indexOf("0") === 0) d = d.slice(1);
    if (d.indexOf("9") === 0 && d.length > 10) d = d.slice(1);
    d = d.replace(/^(\d{2,4})15(\d{6,8})$/, "$1$2");
    return d.length >= 8 ? "+549" + d : String(valor).trim();
  }

  function telefonoValido(valor) {
    var n = digitos(valor).length;
    return n >= 8 && n <= 15;
  }

  /* Un intento. retry=true si vale la pena reintentar (red caída, timeout, 5xx, 429). */
  function intentar(payload) {
    var ctl = new AbortController();
    var t = setTimeout(function () { ctl.abort(); }, TIMEOUT_MS);
    return fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: ctl.signal,
    }).then(
      function (r) {
        clearTimeout(t);
        return { ok: r.ok, retry: !r.ok && (r.status >= 500 || r.status === 429) };
      },
      function () {
        clearTimeout(t);
        return { ok: false, retry: true };
      }
    );
  }

  function leerCola() {
    try { return JSON.parse(localStorage.getItem(COLA) || "[]"); } catch (e) { return []; }
  }
  function guardarCola(c) {
    try { localStorage.setItem(COLA, JSON.stringify(c.slice(-20))); } catch (e) { /* storage bloqueado */ }
  }

  function enviar(payload) {
    var cuerpo = Object.assign({}, payload, { hp: hp ? hp.value : "" });
    return intentar(cuerpo)
      .then(function (r) { return r.retry ? intentar(cuerpo) : r; })
      .then(function (r) {
        if (!r.ok && r.retry) guardarCola(leerCola().concat([payload]));
        return r.ok;
      });
  }

  /* Reenvía lo que quedó en cola de visitas anteriores. */
  function vaciarCola() {
    var cola = leerCola();
    if (!cola.length) return;
    guardarCola([]);
    cola.forEach(function (p) {
      intentar(p).then(function (r) {
        if (!r.ok && r.retry) guardarCola(leerCola().concat([p]));
      });
    });
  }
  vaciarCola();

  w.Lead = { enviar: enviar, normalizarCelular: normalizarCelular, telefonoValido: telefonoValido };
})(window);
