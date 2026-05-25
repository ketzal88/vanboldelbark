# Plan Inmobiliaria Nordelta — Monopolio de Leads

## Visión general

Tres frentes simultáneos para monopolizar leads de compra, venta y alquiler en Nordelta, Villanueva, Bancalari y Delta.

| Frente | Objetivo principal | Estado |
|---|---|---|
| **Plan A — Marketing de Guerrilla** | Captar propietarios que buscan inmobiliaria competidora | 🔴 Por ejecutar |
| **Plan B — Marca propia** | Captar compradores/inquilinos por zona y barrio | 🔴 Por ejecutar |
| **Plan C — Equipo dentro de RE/MAX** | Captar leads desde adentro de la competencia | 🔴 Por ejecutar |
| **Pretasación online** | Lead magnet de alta intención para propietarios | 🔴 Por ejecutar |

---

## FASE 1 — Infraestructura (Semana 1)

### 1.1 — Dominios a comprar

Verificar disponibilidad en nic.ar y Namecheap. Comprar todos en una sola sesión.

**Plan A — Dominios espejo (guerrilla)**

| Dominio | Apunta a | Prioridad |
|---|---|---|
| `remaxnordelta.com.ar` | Landing espejo RE/MAX | 🔴 Alta |
| `remaxbancalari.com.ar` | Landing espejo RE/MAX Bancalari | 🔴 Alta |
| `keymexnordelta.com.ar` | Landing espejo Keymex | 🔴 Alta |
| `toribiotigreventas.com.ar` | Landing espejo Toribio | 🟡 Media |
| `achavalcornejonordelta.com.ar` | Landing espejo Achaval Cornejo | 🟡 Media |
| `izrastzoffnordelta.com.ar` | Landing espejo Izrastzoff | 🟡 Media |
| `prattonordelta.com.ar` | Landing espejo Pratto | 🟢 Baja |
| `maffianordelta.com.ar` | Landing espejo Maffia *(confirmar nombre)* | 🟡 Media |

**Plan B — Dominios propios (marca)**

| Dominio | Uso |
|---|---|
| `nordeltapropiedades.com.ar` | Landing principal marca propia |
| `deltatigreventas.com.ar` | Landing zona Delta/Tigre |
| `villanuevacasas.com.ar` | Landing Villanueva |
| `bancalaripropiedades.com.ar` | Landing Bancalari |
| `pretasacion.com.ar` *(o subdominio)* | Herramienta pretasación |

> **Nota:** Registrar dominios Plan A a nombre de tercero o holding para mayor distancia legal.

### 1.2 — Stack técnico

| Herramienta | Uso |
|---|---|
| NIC.ar / Namecheap | Registro de dominios |
| Vercel | Hosting landings (gratis, deploy instantáneo) |
| HTML/CSS parametrizado | Una base, config por dominio |
| GHL | CRM, pipelines, automatizaciones, tracking |
| Google Ads | Tráfico pago |
| Twilio / GHL Phone | Número de tracking por landing |

### 1.3 — Configuración GHL

**Pipeline A — CAPTACIÓN DE CARTERA** (propietarios que quieren vender/alquilar)

Etapas: Lead nuevo > Contacto realizado > Tasación coordinada > Visita > Exclusividad firmada > Propiedad activa

**Pipeline B — VENTA / ALQUILER** (compradores e inquilinos)

Etapas: Lead nuevo > Perfil calificado > Propiedades enviadas > Visita coordinada > Oferta > Cierre

Tags automáticos por origen: `origen: guerrilla-remax`, `origen: geo-nordelta`, `origen: pretasacion`, `tipo: propietario`, `tipo: comprador`, `tipo: inquilino`

---

## FASE 2 — Landings (Semana 1-2)

### 2.1 — Landing espejo (Plan A)

Una sola base HTML/CSS parametrizada. Variables por brand: color primario, color secundario, nombre marca, tipografía, teléfono tracking, logo (wordmark propio, nunca el oficial).

Estructura:
- Hero: foto zona + headline "Vendé o alquilá tu propiedad en [zona]" + form (Nombre / Tel / ¿Qué necesitás?)
- Trust: propiedades en zona, años experiencia, respuesta en 2hs
- Footer: [Tu Razón Social] — Sitio independiente de búsqueda inmobiliaria

### 2.2 — Landing propia (Plan B)

Misma estructura con tu marca. Diferenciadores: sin comisión oculta, respuesta < 2 horas, conocemos cada barrio.

### 2.3 — Herramienta de Pretasación

Lead magnet de máxima intención. El propietario que la usa está a un paso de querer vender.

**Paso 1 — Datos de la propiedad**
- Zona (Nordelta / Villanueva / Bancalari / Delta / Tigre)
- Barrio específico (dropdown por zona)
- Tipo (Casa / Departamento / Lote)
- Metros cubiertos
- Metros de terreno (si aplica)
- Ambientes
- Estado (A nuevo / Muy bueno / Bueno / Regular)
- ¿Tiene salida al agua?
- ¿Tiene pileta?

**Paso 2 — Datos de contacto**
- Nombre
- Teléfono (WhatsApp)
- Email
- ¿Estás pensando en vender? (Sí pronto / Sí no urgente / Solo curiosidad)

**Paso 3 — Resultado**

Pantalla: "Tu propiedad en [Barrio] vale estimativamente entre USD X y USD Y"

Texto: "Este es un estimado preliminar. Para una tasación precisa y gratuita, un asesor te contactará en 2 horas."

CTA: "Quiero la tasación completa gratis" → WhatsApp directo

**Lógica de rangos:**

| Zona / Tipo | USD/m² base | Ajustes |
|---|---|---|
| Nordelta — Casa al agua | 3.500 - 4.500 | +20% pileta, +15% barrio premium |
| Nordelta — Casa interna | 2.200 - 3.000 | +10% nuevo, -15% regular |
| Nordelta — Lote al agua | 2.800 - 4.000 | por m² terreno |
| Nordelta — Dpto | 2.000 - 2.800 | +10% vista lago |
| Villanueva — Casa | 1.800 - 2.500 | — |
| Bancalari — Casa | 1.600 - 2.200 | — |
| Delta / Tigre | 1.200 - 2.000 | variable por acceso |

**Fórmula:** `Base = m²_cubiertos x precio_base_zona` + ajustes por agua (+20%), estado (nuevo +15%, regular -20%), pileta (+8%). Rango final = [resultado x 0.85, resultado x 1.15]

**Segmentación por intención declarada:**

| Respuesta | Tag GHL | Acción |
|---|---|---|
| Sí, pronto | `propietario-caliente` | Llamar en < 1 hora |
| Sí, no urgente | `propietario-tibio` | Nurture 7 días |
| Solo curiosidad | `propietario-frio` | Nurture 30 días |

---

## FASE 3 — Google Ads (Semana 2)

### Campaña 1 — Guerrilla Competidores (→ propietarios)

Landing: Dominios espejo Plan A

**Grupo 1.1 — Marcas competidoras**

[remax nordelta] / [re max nordelta] / [remax bahia nordelta] / [remax total nordelta] / [remax bancalari] / [remax villanueva tigre] / [keymex nordelta] / [keymex tigre] / [keymex villanueva] / [toribio achaval nordelta] / [toribio achaval tigre] / [achaval cornejo nordelta] / [izrastzoff nordelta] / [pratto propiedades nordelta] / [territory propiedades nordelta] / [tizado nordelta] / [maffia nordelta]

**Grupo 1.2 — Intent vendedor explícito**

[vender casa nordelta] / [tasar propiedad nordelta] / [tasacion nordelta gratis] / [quiero vender mi casa nordelta] / [poner en alquiler casa nordelta] / [administracion alquileres nordelta] / [vender casa villanueva tigre] / [vender propiedad bancalari]

Copy: Titular 1: "¿Vendés en Nordelta? Tasación Gratis" / Titular 2: "Compradores Activos Esperando Ahora" / Titular 3: "Respondemos en Menos de 2 Horas"

### Campaña 2 — Geográfica (→ compradores/inquilinos)

Landing: Marca propia Plan B

**Grupo 2.1 — Nordelta:** [casas en venta nordelta] / [propiedades nordelta] / [inmobiliaria nordelta] / [nordelta lotes venta] / [departamentos nordelta venta] / [alquiler nordelta]

**Grupo 2.2 — Villanueva:** [casas villanueva tigre] / [villanueva propiedades] / [inmobiliaria villanueva tigre] / [casas en venta villanueva]

**Grupo 2.3 — Bancalari:** [bancalari propiedades] / [casas bancalari] / [inmobiliaria bancalari] / [corredor bancalari casas] / [santa barbara bancalari venta]

**Grupo 2.4 — Delta / Tigre:** [inmobiliaria tigre delta] / [casas delta tigre] / [propiedades tigre venta] / [tigre barrios cerrados venta] / [benavidez casas venta]

### Campaña 3 — Intención directa

**Comprador activo:** [comprar casa nordelta] / [casa al lago nordelta precio] / [lote nordelta precio] / [cuanto sale una casa en nordelta] / [casas al agua nordelta venta]

**Inquilino:** [alquiler casa nordelta] / [alquiler nordelta barrio cerrado] / [alquiler villanueva tigre] / [alquiler temporario nordelta]

### Campaña 4 — Barrios hiperlocal

**Barrios premium:** [los carpinchos nordelta venta] / [el golf nordelta casas] / [bahia grande nordelta] / [los castores nordelta venta] / [virazón nordelta casas] / [el yacht nordelta] / [los puentes nordelta] / [portezuelo nordelta] / [santa barbara tigre venta]

**Barrios mid:** [los alisos nordelta] / [la alameda nordelta] / [talar del lago venta] / [las glorietas nordelta] / [los castaños nordelta] / [santa catalina nordelta]

### Campaña 5 — Pretasación

Landing: Herramienta pretasación

[pretasacion nordelta] / [cuanto vale mi casa nordelta] / [cuanto vale mi propiedad nordelta] / [tasacion online nordelta] / [valor de mi casa nordelta] / [valor propiedades nordelta] / "cuánto vale mi casa en nordelta" / "tasación online gratis nordelta"

Copy: Titular 1: "¿Cuánto Vale Tu Casa en Nordelta?" / Titular 2: "Pretasación Online Gratis en 2 Minutos" / Titular 3: "Resultado Inmediato · Sin Registro"

### Keywords negativas globales

trabajo / empleo / franquicia / ser corredor / matrícula / curso corredor / gratis alquiler / mapa nordelta / historia nordelta / wikipedia / noticias / accidente / como llegar / restaurante / hotel / turismo

### Configuración técnica

| Parámetro | Valor |
|---|---|
| Red | Solo búsqueda |
| Geo | Radio 20km Nordelta + GBA Norte |
| Horario | L-S 8am-10pm |
| Mobile bid adj | +20% |
| Conversión | Form submit GHL → webhook → Google Ads |

---

## FASE 4 — Plan C: Equipo dentro de RE/MAX (Semana 2-3)

1. Identificar oficinas RE/MAX en Nordelta: RE/MAX Bahía (Bahía Grande) y RE/MAX Total (Nordelta)
2. Contactar como agente interesado en sumarse
3. El agente opera normalmente y cierra operaciones reales
4. Leads fuera de perfil o no cerrados se derivan a inmobiliaria propia
5. Acceso a info de mercado, precios y cartera de la zona

---

## FASE 5 — Automatización GHL (Semana 3)

**Propietario caliente:** WhatsApp inmediato (D0) > Llamada < 1h (D0) > Email pretasación + próximos pasos (D1) > WhatsApp follow-up (D3)

**Propietario tibio:** WhatsApp resultado (D0) > Email mercado en alza (D3) > WhatsApp caso de éxito (D7) > Email compradores en zona (D14) > WhatsApp retoque (D30)

**Comprador activo:** WhatsApp con propiedades (D0) > Email listado 3-5 propiedades (D0) > Llamada (D1) > WhatsApp follow-up (D3)

---

## CHECKLIST DE EJECUCIÓN

### Semana 1
- [ ] Confirmar nombre exacto de Maffia Propiedades
- [ ] Verificar disponibilidad de todos los dominios en nic.ar
- [ ] Comprar dominios Plan A y Plan B
- [ ] Crear cuenta Google Ads
- [ ] Configurar pipelines en GHL
- [ ] Definir razón social para footer landings Plan A
- [ ] Scraping visual webs competidores (RE/MAX, Keymex, Toribio)

### Semana 2
- [ ] Desarrollar landing base HTML parametrizada
- [ ] Deploy en Vercel con todos los dominios
- [ ] Configurar form → GHL webhook con tags de origen
- [ ] Construir herramienta pretasación (HTML estático + JS)
- [ ] Cargar estructura completa en Google Ads
- [ ] Instalar tracking conversiones Google Ads ↔ GHL
- [ ] Contactar RE/MAX Bahía / RE/MAX Total para Plan C

### Semana 3
- [ ] Lanzar Campaña 1 (Guerrilla)
- [ ] Lanzar Campañas 2, 3 y 4 (Geográfica + Intención + Barrios)
- [ ] Lanzar Campaña 5 (Pretasación)
- [ ] Configurar secuencias nurture en GHL
- [ ] Primera revisión CPL y ajuste de bids

### Semana 4
- [ ] Análisis resultados por campaña
- [ ] Pausar keywords de bajo rendimiento
- [ ] Activar tCPA cuando haya 15+ conversiones por campaña
- [ ] Evaluar si agregar Meta Ads (retargeting)

---

## BUDGET ESTIMADO DE ARRANQUE

| Ítem | Costo |
|---|---|
| Dominios (~13 dominios .com.ar) | USD 100-130 |
| Google Ads — mes 1 | USD 500-800 |
| Desarrollo landings | USD 0-400 |
| GHL | USD 97/mes |
| **Total arranque** | **~USD 700-1.400** |

Costo por lead inmobiliario estimado: USD 8-25. Con USD 600 en ads se pueden esperar 30-70 leads el primer mes.

---

## PENDIENTES

- [ ] Confirmar nombre exacto de Maffia Propiedades
- [ ] Definir nombre/marca de la inmobiliaria propia
- [ ] Confirmar presupuesto inicial para ads
- [ ] Definir si la pretasación se desarrolla como artifact HTML o se integra a Worker Brain

---

## ANÁLISIS COMPETITIVO SERP — Mapeo de Dominantes

Relevamiento de las inmobiliarias que dominan los primeros resultados de Google para las keywords objetivo. Sirve para tres cosas: (1) identificar a quién atacar con guerrilla Plan A, (2) entender contra quién competir SEO orgánico, (3) detectar huecos en el mercado.

### Zona Nordelta / Tigre / Villanueva / Bancalari

#### Top 4 inmobiliarias dominantes (objetivos prioritarios para Plan A)

| # | Inmobiliaria | Dominio | Por qué dominan SERP |
|---|---|---|---|
| 1 | **Izrastzoff** | izr.com.ar | Páginas optimizadas por ciudad/barrio (`/inmobiliaria-nordelta`, `/inmobiliaria-san-isidro`, `/santa-barbara`). 50+ años de marca. Oficina física en Puerta Norte II. Branding clásico "líder Zona Norte" |
| 2 | **Tizado** | tizado.com/nordelta | URL exacta `/nordelta` que rankea consistentemente. Landing por barrio. Marca premium |
| 3 | **RE/MAX (Bahía + Total + Class + Uno)** | remax.com.ar/propiedades-en-nordelta | Múltiples franquicias compitiendo entre sí dentro de la misma zona. Volumen masivo de listings. **Debilidad explotable: fragmentación interna confunde al usuario** |
| 4 | **Pratto Propiedades** | prattopropiedades.com | "25 años en barrios cerrados Zona Norte". Branding fuerte territorial. Oficina en Nordelta |

#### Segundo anillo (presencia recurrente en SERP)

- **Rosario Costantini** (rosariocostantini.com.ar) — alto volumen en lotes y casas premium
- **Iglesias Re / Gabriela Iglesias** (iglesiasre.com) — empresa familiar que vive en Nordelta, posicionamiento local fuerte
- **Bahía Corp** (bahiacorp.com.ar) — staff joven, presencia en barrios premium
- **Bustamante Propiedades** (bustamantepropiedades.com) — fuerte en Villanueva. **Importante: registró el dominio `villanueva-inmobiliaria.com` (URL exacta de KW). Validación clara de la lógica Plan A pero hecha legítima**
- **Buratti Propiedades** — Santa Bárbara
- **LJ Ramos** — sucursal Nordelta
- **Berraz, Órbita, Luchia Puig, Territory, Mosquera Gallastegui** — alta presencia en MercadoLibre/Argenprop con listings Villanueva/Santa Ana

#### Portales agregadores (enemigo SEO real)

Dominan KW genéricas tipo `casas en venta nordelta`. **No se les gana con SEO orgánico** — solo con paid + branded:

- Zonaprop
- Argenprop
- MercadoLibre Inmuebles
- Properati
- Mudafy
- TodoProps (lead aggregator que distribuye a inmobiliarias)
- iCasas / Trovit

### Zona San Isidro / Vicente López

#### Top 4 inmobiliarias dominantes

| # | Inmobiliaria | Dominio | Notas |
|---|---|---|---|
| 1 | **Toribio Achaval** | toribioachaval.com | URLs limpias `/listado/venta/san-isidro` y `/vicente-lopez`. Marca premium clásica |
| 2 | **Izrastzoff** | izr.com.ar | Mismo patrón ganador que en Nordelta. Domina ambas zonas |
| 3 | **RE/MAX** | remax.com.ar/propiedades-en-{zona} | Volumen masivo |
| 4 | **DIC Propiedades** | — | Pitch agresivo: "1.700 propiedades en comercialización, 137.000 tasaciones, 950.000 m² vendidos". Muy fuerte en San Isidro |

#### Segundo anillo (San Isidro / Vicente López)

- **Martin Propiedades** (martinprop.com.ar) — Martínez/Olivos, oficinas físicas en ambos
- **Solución Inmobiliaria** (solucioninmobiliaria.com.ar) — San Isidro
- **De Brasi Propiedades** (debrasi.com.ar) — Olivos/Martínez/Beccar premium
- **Alec Hyland** (alechyland.com) — Beccar/San Isidro tradicional
- **Calpar Propiedades** (calparpropiedades.com.ar) — Beccar. **Juega bien la KW "tasación gratuita en 48hs"**
- **Castilla Propiedades** (castillapropiedades.com.ar) — San Isidro/Tigre, blog SEO sobre tasaciones
- **Salaya Romera** — Vicente López/Olivos premium
- **Haase Brokers** — Belgrano + Vicente López
- **DER & Asoc., Belga Inmobiliaria, Pastori, Martin Fonseca** — Olivos/Martínez

### Insights estratégicos clave

#### 1. Patrón de URL ganador para SEO local

Los 4 dominantes coinciden en la estructura URL. Replicar esto en Plan B:
- Toribio Achaval: `/listado/venta/{zona}` — clean
- Izrastzoff: `/inmobiliaria-{zona}` — targetea KW cabeza
- Tizado: `/{zona}` — simplicidad
- RE/MAX: `/propiedades-en-{zona}` — formato escalable

#### 2. HUECO GIGANTE: nadie tiene pretasación online seria

Los competidores que dicen "pedir tasación" son **todos formularios de contacto clásicos**, no herramientas instantáneas. Los players nacionales que sí tienen herramienta online no están especializados en Nordelta.

**Oportunidad: ser el especialista hiperlocal de la zona con pretasación online instantánea = ganador absoluto en KW vendedor.**

#### 3. RE/MAX está fragmentado — debilidad explotable para Plan A

Un usuario que busca "remax nordelta" termina confundido entre RE/MAX Bahía, RE/MAX Total, RE/MAX Class y RE/MAX Uno. **Quien ofrezca claridad gana.**

#### 4. Marcas más fuertes para mirror Plan A

- **Izrastzoff** = más reputación / branding emocional
- **Toribio Achaval** = más SEO técnico / dominio premium
- **RE/MAX** = más volumen pero fragmentado (oportunidad)
- **Tizado** = clean SEO + URL atómica

#### 5. Modelo a estudiar: tasacionesdeinmuebles.com.ar

Lead-gen puro con foco propietario. Tienen IA, simulador online, narrativa convincente. **Es exactamente el playbook que estamos armando con la pretasación**, pero ellos juegan a nivel nacional. Vos jugás hiperlocal y ganás especialización.

#### 6. Validación del modelo Plan A: caso Bustamante

Bustamante registró `villanueva-inmobiliaria.com` (URL exacta de KW alta intención) y rankea fuerte para `venta de casas en villanueva tigre`. **Confirma que la estrategia de dominio-keyword-exacta funciona en esta zona.**

---

## VERIFICACIÓN DE DOMINIOS — Plan A + Plan B

### Costos NIC.AR (2026)

| Extensión | Costo anual ARS | Costo aprox USD |
|---|---|---|
| `.com.ar` | $8.500 | ~USD 8 |
| `.net.ar` | $8.500 | ~USD 8 |
| `.ar` (corto) | $25.500 | ~USD 24 |
| Disputa de dominio | $28.800 | ~USD 27 |

> Comprar 25-30 dominios .com.ar es trivial — total ~USD 200-250/año. No hay razón para no registrar todo el árbol defensivo de una.

### Plan A — Dominios mirror (competidores)

| Estado | Dominio | Prioridad | Notas |
|---|---|---|---|
| 🟢 Libre | `remaxnordelta.com.ar` | 🔴 Alta | Target principal RE/MAX |
| 🟢 Libre | `remaxnordelta.com` | 🔴 Alta | Comprar también el .com global |
| 🟢 Libre | `remaxbancalari.com.ar` | 🔴 Alta | |
| 🟢 Libre | `remaxvillanueva.com.ar` | 🔴 Alta | |
| 🟢 Libre | `remaxtigre.com.ar` | 🔴 Alta | |
| 🟢 Libre | `remaxtotal.com.ar` | 🟡 Media | Una de las 4 franquicias RE/MAX |
| 🟡 Parked | `remaxbahia.com.ar` | — | Resuelve a Cloudflare 403, posiblemente parked. Confirmar en nic.ar |
| 🟢 Libre | `keymexnordelta.com.ar` | 🔴 Alta | |
| 🟢 Libre | `keymextigre.com.ar` | 🟡 Media | |
| 🟢 Libre | `keymexvillanueva.com.ar` | 🟡 Media | |
| 🟢 Libre | `toribioachavalnordelta.com.ar` | 🔴 Alta | Target SEO premium |
| 🟢 Libre | `toribioachaval-nordelta.com.ar` | 🟡 Media | Variante con guion |
| 🟢 Libre | `toribiotigreventas.com.ar` | 🟡 Media | |
| 🟢 Libre | `toribionordelta.com.ar` | 🟢 Baja | Versión corta |
| 🟢 Libre | `achavalcornejonordelta.com.ar` | 🟡 Media | |
| 🟢 Libre | `izrastzoffnordelta.com.ar` | 🔴 Alta | Izrastzoff = mayor reputación |
| 🟢 Libre | `izrnordelta.com.ar` | 🟡 Media | Versión corta del brand |
| 🟢 Libre | `prattonordelta.com.ar` | 🟡 Media | |
| 🟢 Libre | `prattopropiedadesnordelta.com.ar` | 🟢 Baja | Largo |
| 🟢 Libre | `tizadonordelta.com.ar` | 🔴 Alta | Tizado domina SERP con `/nordelta` |
| 🟢 Libre | `maffianordelta.com.ar` | 🟡 Media | Confirmar nombre exacto Maffia |
| 🟢 Libre | `mafianordelta.com.ar` | 🟢 Baja | Variante una sola F |
| 🟢 Libre | `territorynordelta.com.ar` | 🟡 Media | Territory Propiedades |

**Conclusión Plan A:** 22 de 23 dominios mirror están libres. El único pendiente es `remaxbahia.com.ar`.

### Plan B — Dominios marca propia

| Estado | Dominio | Prioridad | Notas |
|---|---|---|---|
| 🟢 Libre | `nordeltapropiedades.com.ar` | 🔴 Alta | **Candidato a brand principal** |
| 🟢 Libre | `nordeltapropiedades.com` | 🔴 Alta | Comprar también el .com |
| 🟢 Libre | `nordeltainmobiliaria.com.ar` | 🔴 Alta | Captura intent "inmobiliaria nordelta" |
| 🟡 503 | `nordeltacasas.com.ar` | — | DNS resuelve, server 503. Confirmar nic.ar |
| 🟢 Libre | `nordelta-propiedades.com.ar` | 🟢 Baja | Variante con guion |
| 🟢 Libre | `deltatigreventas.com.ar` | 🟡 Media | |
| 🟢 Libre | `villanuevacasas.com.ar` | 🔴 Alta | Villanueva-específico |
| 🟢 Libre | `villanuevapropiedades.com.ar` | 🔴 Alta | |
| 🟢 Libre | `villanueva-inmobiliaria.com.ar` | 🔴 Alta | **Bustamante tiene el `.com`. Tomar `.com.ar` antes que ellos** |
| 🟢 Libre | `bancalaripropiedades.com.ar` | 🔴 Alta | |
| 🟢 Libre | `bancalaricasas.com.ar` | 🟡 Media | |
| 🟢 Libre | `tigredeltapropiedades.com.ar` | 🟡 Media | |
| 🟢 Libre | `pretasacion.com.ar` | 🔴 Alta | **Brand pretasación standalone** |
| 🟢 Libre | `pretasacionnordelta.com.ar` | 🔴 Alta | Hiper-específico para Ads |
| 🟢 Libre | `tasacionnordelta.com.ar` | 🔴 Alta | Captura KW "tasación nordelta" |
| 🟢 Libre | `tunordelta.com.ar` | 🟢 Baja | Brand corta tipo "Tu Nordelta" |
| 🟢 Libre | `leadsnordelta.com.ar` | 🟢 Baja | B2B / interno |

**Conclusión Plan B:** 15 de 17 libres. Hallazgo crítico: `villanueva-inmobiliaria.com.ar` libre — Bustamante ya tiene el `.com` pero no protegió el `.com.ar`.

### Hallazgos críticos

1. **Cobertura casi total:** 37 de 40 dominios candidatos están libres. Costo ~USD 300/año por todo el árbol.
2. **`pretasacion.com.ar` libre** = oportunidad de marca standalone para la herramienta.
3. **Hueco Bustamante:** tienen `villanueva-inmobiliaria.com` pero NO el `.com.ar`. Comprar antes que lo noten.
4. **Cloudflare en `remaxbahia.com.ar`:** señal de que algunas franquicias RE/MAX están registrando defensivamente. Mover rápido.
5. **No verificado:** marcas registradas en INPI. Confirmar legalmente antes de levantar landings espejo Plan A.

### Acción inmediata — Sesión única de compra en NIC.AR

#### Tier 1 — Comprar HOY (16 dominios, ~USD 130)

```
remaxnordelta.com.ar
remaxbancalari.com.ar
remaxvillanueva.com.ar
remaxtigre.com.ar
keymexnordelta.com.ar
toribioachavalnordelta.com.ar
izrastzoffnordelta.com.ar
tizadonordelta.com.ar
nordeltapropiedades.com.ar
nordeltainmobiliaria.com.ar
villanuevacasas.com.ar
villanuevapropiedades.com.ar
villanueva-inmobiliaria.com.ar  ← bloquear a Bustamante
bancalaripropiedades.com.ar
pretasacion.com.ar
pretasacionnordelta.com.ar
```

#### Tier 2 — Defensivos (8 dominios, ~USD 65)

```
remaxtotal.com.ar
keymextigre.com.ar
keymexvillanueva.com.ar
achavalcornejonordelta.com.ar
prattonordelta.com.ar
maffianordelta.com.ar
territorynordelta.com.ar
tasacionnordelta.com.ar
```

#### Tier 3 — Globales `.com` (2 dominios, ~USD 30)

```
remaxnordelta.com
nordeltapropiedades.com
```

**Total inversión inicial: ~USD 225** (todo el árbol defensivo + ofensivo).

### Antes de comprar Plan A

- [ ] Registrar dominios Plan A a nombre de holding/tercero, no a tu CUIT directo (distancia legal)
- [ ] Consultar abogado de marcas sobre exposición a denuncias INPI (Toribio Achaval e Izrastzoff están registradas como marca)
- [ ] Definir contenido legal en footer: "Sitio independiente — no afiliado a [marca]"

---

## INVERSIÓN EN ADS — Math inversa para 10 propiedades/mes

Objetivo: **10 propiedades en exclusiva por mes**.

### Funnel de captación — tasas de conversión esperadas (zona premium AMBA)

| Paso del funnel | Tasa esperada | Notas |
|---|---|---|
| Lead → Tasación coordinada | 30-40% | Responde teléfono + acepta visita |
| Tasación → Exclusividad firmada | 25-35% | Ganás sobre 2-3 inmobiliarias competidoras |
| **Conversión total Lead → Propiedad** | **8-12%** | Mix ponderado |

### Conversión por tier de lead

| Tier | Mix esperado | Conv. a propiedad | Volumen requerido |
|---|---|---|---|
| 🔥 Caliente ("vender pronto") | 25% | 20-25% | 30-35 leads para 6-8 cierres |
| 🟡 Tibio ("no urgente") | 40% | 5-8% | 50-60 leads para 2-4 cierres |
| ❄️ Frío ("solo curiosidad") | 35% | 1-2% | 40-50 leads para ~1 cierre |

**Conclusión:** para 10 propiedades/mes con tasas conservadoras = **120-150 leads de propietario por mes**.

### Escenarios de inversión

#### Escenario A — Conservador (test de 90 días) — USD 1.500/mes

| Canal | USD/mes | Lógica |
|---|---|---|
| Google Ads — Guerrilla competidores | 400 | Alta intención, CPC alto pero CPL bajo |
| Google Ads — Geo + Pretasación | 500 | Volumen + lead magnet |
| Meta Ads — Propietarios Nordelta | 400 | Targeting por zona + interés real estate |
| Meta Ads — Retargeting | 200 | Quien vio landing pero no convirtió |

- CPL esperado mix: **USD 12-18**
- Leads/mes: **80-125**
- Propiedades cerradas: **6-10/mes**

#### Escenario B — Recomendado — USD 2.500/mes

| Canal | USD/mes | Lógica |
|---|---|---|
| Google Ads — Guerrilla competidores | 600 | Highest-intent, escalar |
| Google Ads — Geo + Intent vendedor | 700 | Cubrir todas las KW |
| Google Ads — Pretasación (Camp 5) | 500 | Lead magnet specific |
| Meta Ads — Propietarios + Lookalike | 500 | Volumen + lookalikes de leads convertidos |
| Meta Ads — Retargeting | 200 | Pixel warm audiences |

- CPL esperado mix: **USD 10-16**
- Leads/mes: **155-250**
- Propiedades cerradas: **12-20/mes**

#### Escenario C — Agresivo — USD 4.000/mes

Mismo split proporcional. Leads/mes: **250-400**, propiedades: **20-32/mes**.

> ⚠️ A este nivel el cuello de botella deja de ser el lead y pasa a ser capacidad operativa. Sin equipo o sin proceso semi-automatizado en GHL, escalar arriba de USD 2.500 es plata tirada.

### Benchmarks de referencia

- CPC Google Ads zona Nordelta: USD 1.50-3.50 (KW marca competidor) / USD 0.80-2.00 (KW genéricas geo)
- CTR landing pretasación bien hecha: 4-7%
- Conversión landing → form completo (pretasación): 12-20% (vs 2-4% formulario contacto clásico)
- CPL Meta Ads propietarios AMBA Norte premium: USD 8-15
- Costo por exclusividad firmada zona premium: USD 150-300
- Comisión promedio operación Nordelta (USD 600K-1.2M @ 3-4%): **USD 18.000-48.000**

**ROI implicado:** 1 propiedad cerrada con costo USD 250 y comisión USD 25.000 = **ROI 100x** sobre el ad spend de captación.

### Recomendación

**Empezar Escenario A (USD 1.500/mes) durante 60-90 días para:**
1. Validar CPL real en tu zona
2. Optimizar landings y secuencias GHL
3. Identificar qué KW/audiencias rinden mejor
4. Acumular pixel data para lookalikes

**A los 90 días, escalar a Escenario B (USD 2.500)** apagando lo que no rinde y duplicando lo que sí.

### Lo que la math NO captura

1. **Calidad del seguimiento es el 50% del resultado.** Respuesta en < 2hs y secuencia GHL bien armada → 12 propiedades. Respuesta en 24hs → 4 propiedades.
2. **Plan A tiene un kicker invisible:** leads de KW "remax nordelta" están en modo decisión activa. Cierran más alto (15-25% lead → propiedad).
3. **Meta vs Google:** Meta no tiene "intent" — interrumpís. Lead promedio más frío pero volumen mayor y CPL más bajo. Meta ideal para alimentar el funnel pretasación. Google ideal para captar intent vendedor explícito.
4. **Plan C (RE/MAX desde adentro)** podría aportar 3-5 propiedades/mes adicionales gratis.
5. **Estacionalidad AR:** marzo-junio y septiembre-noviembre son los mejores meses. Diciembre-febrero baja 30-40%.
