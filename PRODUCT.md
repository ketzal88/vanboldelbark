# Product

## Register

brand

## Users

**Primario — Propietario en zona evaluando vender.**
Buscan en Google con intención alta pero baja confianza: "cuánto vale mi propiedad nordelta", "tasación villanueva", "vender casa al agua tigre". Llegan curiosos o comparando, no listos para hablar con un asesor todavía. El trabajo que quieren hacer es **saber un número real sin tener que dar el teléfono a tres inmobiliarias**. La pretasación los convierte en lead de alta intención sin fricción.

**Secundario — Comprador / inquilino hiperlocal.**
Busca por zona o barrio específico ("departamentos villanueva", "alquiler bancalari"). Está saturado por la fragmentación de RE/MAX (4 franquicias compitiendo entre sí en la misma zona) y por la falta de claridad de Tizado / Pratto / Izrastzoff. Quiere un solo interlocutor que conozca el barrio.

**Terciario — Propietario llegando por landing-espejo de competencia (Plan A guerrilla).**
Tipeó "remax nordelta" y aterrizó en una landing que parece RE/MAX pero responde en 2 horas. Lead que ya estaba intentando contratar a la competencia.

## Product Purpose

Monopolizar los leads de compra, venta y alquiler de Nordelta, Villanueva, Bancalari y Delta del Tigre a través de un portfolio de landings de alta conversión que cubre tres lanes simultáneos: pretasación online (lead magnet único en el mercado local), marca propia hiperlocal (Plan B), y landings espejo que capturan tráfico de marca competidora (Plan A).

El éxito se mide en leads cualificados entregados a GHL con su tag de intención correcto (`propietario-caliente` < 1h respuesta, `propietario-tibio` nurture 7 días, `propietario-frio` nurture 30 días). Cada landing existe para una sola conversión.

## Brand Personality

**Premium · serio · institucional.**

Voz de asesor que conoce el barrio cuadra por cuadra. Tono más cercano a un estudio jurídico boutique o una inmobiliaria de country tradicional que a una proptech. Autoridad por información específica (USD/m² real por barrio, tiempos de venta promedio, comparables) en lugar de adjetivos vacíos ("los mejores", "líderes", "expertos").

Lo institucional acá es **restraint**, no pompa: paleta corta, tipografía cuidada, copy desadornado, mucho aire. Premium sin barniz dorado.

Lo serio convive con una herramienta digital moderna (pretasación instantánea) que la competencia tradicional no tiene. Esa contradicción aparente es el filo: peso institucional + tooling de 2026.

## Anti-references

- **La inmobiliaria tradicional amarillenta** (Toribio Achaval-style): backgrounds beige/crema warm, serifa decorativa, layouts apretados con muchas fotos chicas, "experiencia desde 1980". El anti-referente principal — todo lo que evoque polvo, tinte sepia o "siempre lo hicimos así" está fuera.
- **El caos RE/MAX**: rojo + azul fuerte saturados, formularios largos y genéricos, CTA disperso, 4 franquicias compitiendo en la misma zona. Si el usuario nos confunde con cualquiera de las 4, perdimos.
- **El glassmorphism proptech / SaaS template**: cards traslúcidas, gradientes violetas, hero de big-number con gradiente, eyebrow tracked en cada sección. Plantilla cliché de startup, falsa modernidad. Inmobiliaria seria no es Notion.
- **El logo oficial de competidores en las landings espejo.** Wordmark propio, color similar, layout análogo — nunca el logotipo registrado. Línea legal y línea de diseño coinciden.

## Design Principles

1. **Autoridad por especificidad, no por adjetivos.** "USD 2.800/m² promedio en Nordelta casa interna, +20% si tiene salida al agua" supera a "los mejores precios del mercado". Cada claim que no se puede defender con un número o un comparable, se borra.

2. **Una sola conversión por landing.** Pretasación termina en wizard. Vender termina en form. Comprar termina en WhatsApp. Nunca se ofrecen 3 caminos en la misma página — eso es lo que hace RE/MAX y por eso pierde.

3. **Respuesta en 2 horas no es un claim, es el diferenciador estructural.** Cada decisión de diseño (largo del form, jerarquía del CTA, peso del trust block) se mide contra: ¿esto acelera la respuesta y baja la fricción a ingresar al CRM, o la entorpece?

4. **Hiperlocalidad explícita en cada elemento.** El H1 nombra el barrio. El schema enumera los barrios servidos. El copy menciona calles, lagunas, accesos. Generalidad = invisibilidad en Google y en la mente del usuario. "Inmobiliaria Zona Norte" pierde frente a "Especialista Nordelta + Villanueva + Bancalari".

5. **Dignidad institucional sin pomposidad.** Premium se consigue con restraint: paleta de 4-5 roles, una familia tipográfica bien afinada (no oro + serif florida + 3 fuentes), bordes finos, espaciado generoso, motion mínimo y a propósito. El sitio debe poder convivir en la misma mente del usuario que un estudio contable de Zona Norte, no que un launchpad de criptomonedas.

## Accessibility & Inclusion

Lo mínimo necesario para no perder conversión:

- Contraste de cuerpo y CTA suficiente para ser legibles en mobile bajo sol (objetivo informal ≥ 4.5:1 en texto de cuerpo, ≥ 3:1 en CTA grandes). No es WCAG AA estricto en todo, pero sí en superficies de conversión (form, CTA, headline).
- Focus visible en inputs y CTAs (no `outline: none` sin reemplazo).
- `prefers-reduced-motion` respetado en cualquier animación que se agregue. Motion no es prioridad de la marca.
- Spanish (es-AR) como idioma único en el horizonte cercano. `lang="es"`, schema en es, copy localizado (USD, m², barrios reales).
- Prioridad de performance: LCP < 2.5s en 4G mobile. Fuentes con `display=swap`, imágenes optimizadas, JS mínimo. La velocidad es accesibilidad funcional para esta audiencia.
