# CLAUDE.md — Inmobiliaria Nordelta / Monopolio de Leads

## Contexto del proyecto

Sistema de captación de leads inmobiliarios para Nordelta, Villanueva, Bancalari y Delta (Zona Norte AMBA). El objetivo es monopolizar los leads de compra, venta y alquiler en la zona a través de tres frentes simultáneos.

## Stack técnico

| Herramienta | Uso |
|---|---|
| HTML/CSS/JS (estático) | Landings — una base parametrizada por dominio |
| Vercel | Hosting y deploy instantáneo |
| GHL (GoHighLevel) | CRM, pipelines, webhooks, secuencias nurture |
| Google Ads | Tráfico pago — búsqueda |
| Meta Ads | Retargeting + audiencias propietarios |

## Los tres frentes

- **Plan A — Guerrilla**: dominios espejo de competidores (remax, keymex, izrastzoff, tizado…) → captar propietarios que buscan la competencia
- **Plan B — Marca propia**: `nordeltapropiedades.com.ar`, `villanuevacasas.com.ar`, etc. → captar compradores/inquilinos
- **Plan C — RE/MAX desde adentro**: agente dentro de franquicia competidora que deriva leads

## Herramienta pretasación (lead magnet crítico)

Formulario 3 pasos → resultado instantáneo USD X–Y → CTA WhatsApp.

**Lógica de rangos USD/m²:**
- Nordelta casa al agua: 3.500–4.500 (ajuste +20% pileta, +15% barrio premium)
- Nordelta casa interna: 2.200–3.000 (+10% nuevo, -15% regular)
- Nordelta lote al agua: 2.800–4.000
- Nordelta dpto: 2.000–2.800
- Villanueva casa: 1.800–2.500
- Bancalari casa: 1.600–2.200
- Delta/Tigre: 1.200–2.000

**Fórmula:** `base = m²_cubiertos × precio_base` + agua (+20%) + estado (nuevo +15%, regular -20%) + pileta (+8%). Rango = [resultado × 0.85, resultado × 1.15]

**Tags GHL por intención:**
- "Sí pronto" → `propietario-caliente` → llamar < 1h
- "Sí no urgente" → `propietario-tibio` → nurture 7 días
- "Solo curiosidad" → `propietario-frio` → nurture 30 días

## Estructura de landings

Todo el HTML es **estático, parametrizado, sin frameworks pesados**. Variables por brand:
- Color primario/secundario
- Nombre marca
- Teléfono tracking (uno por landing)
- Logo wordmark (nunca el logo oficial de competidores)

Estructura de cada landing:
1. **Hero** — foto zona + headline + form (nombre/tel/necesidad)
2. **Trust** — propiedades en zona, años experiencia, respuesta 2hs
3. **Footer** — razón social + disclaimer "Sitio independiente de búsqueda inmobiliaria"

## Integración GHL

Los forms envían a un webhook de GHL que:
- Crea el contacto
- Aplica tags de origen automáticos (`origen: guerrilla-remax`, `origen: pretasacion`, etc.)
- Dispara la secuencia nurture correspondiente al tag

## Convenciones de código

- HTML/CSS vanilla preferido — sin dependencias npm innecesarias
- Mobile-first (375px). Siempre verificar en viewport angosto antes de deploy
- Un solo archivo JS por landing salvo que sea la pretasación (que puede tener su propio módulo)
- No trackear secrets (API keys GHL, webhook URLs) en el repositorio — usar variables de entorno en Vercel o comentarios `<!-- TODO: reemplazar con var env -->`

## Skills disponibles en este proyecto

| Skill | Cuándo usarla |
|---|---|
| `ui-ux-pro-max` | Diseñar/revisar cualquier landing, componente visual, paleta |
| `meta-ads-creative` | Armar creatividades y copy para campañas Meta |
| `paid-ads` | Copy de Google Ads, estructura de campañas, checklists |
| `vercel-react-best-practices` | Si se agrega React/Next.js para la pretasación |

## Competidores principales (Plan A targets)

Izrastzoff (izr.com.ar), Tizado, RE/MAX (4 franquicias fragmentadas), Toribio Achaval, Pratto Propiedades, Keymex, Achaval Cornejo.

**Debilidad RE/MAX explotable:** 4 franquicias (Bahía, Total, Class, Uno) compitiendo entre sí → usuario confundido. Quien ofrezca claridad gana.

## Hallazgo estratégico clave

Nadie en la zona tiene pretasación online instantánea seria. Todos los competidores usan formularios de contacto clásicos. **Ser el especialista hiperlocal con pretasación online = ventaja competitiva absoluta en keywords de propietario.**

## Design Context

Ver [PRODUCT.md](PRODUCT.md) antes de tocar cualquier landing. Define register, usuarios, anti-referencias y los 5 principios de diseño que guían toda decisión visual.

**Resumen operativo:**

- **Register:** brand (cada landing es una superficie de conversión; el diseño ES el producto)
- **Personalidad:** premium · serio · institucional — autoridad por restraint, no por pompa
- **Superficie prioritaria:** `pretasacion/` (lead magnet, único diferenciador en el mercado local)
- **Color anchor marca propia (pivot):** verde náutico oscuro / petróleo (OKLCH ~0.30 L, ~0.06 C, hue ~200) — distingue de azul-fintech (RE/MAX) y rojo-saturado (RE/MAX)
- **Anti-ref principal:** la inmobiliaria amarillenta tradicional (beige warm + serifa decorativa + layouts apretados, Toribio-Achaval-style). Secundarios: caos RE/MAX, glassmorphism proptech
- **A11y:** mínimo necesario para no perder conversión (contraste legible en mobile bajo sol, focus visible, prefers-reduced-motion respetado)

Cuando tengas dudas de diseño, leer PRODUCT.md primero. Cuando exista, DESIGN.md cubrirá los tokens visuales concretos.
