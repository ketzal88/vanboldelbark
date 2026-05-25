# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cotizador.spec.js >> Mobile responsive (375px) >> 11.07 — Toggles de agua/pileta clickeables en mobile
- Location: tests\cotizador.spec.js:991:3

# Error details

```
Test timeout of 15000ms exceeded.
```

```
Error: page.check: Test timeout of 15000ms exceeded.
Call log:
  - waiting for locator('[data-testid="agua-si"]')
    - locator resolved to <input value="si" name="agua" type="radio" id="agua-si" data-testid="agua-si"/>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
      - waiting 100ms
    28 × waiting for element to be visible, enabled and stable
       - element is not visible
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]: TasaciónOnline
    - generic [ref=e4]: 🔒 Gratuita · Sin compromiso · 2 minutos
  - generic [ref=e5]:
    - generic [ref=e6]: Pretasación Instantánea
    - heading "¿Cuánto vale tu propiedad en Nordelta y Zona Norte?" [level=1] [ref=e7]:
      - text: ¿Cuánto vale tu propiedad
      - text: en Nordelta y Zona Norte?
    - paragraph [ref=e8]: Resultado en USD en 2 minutos. Sin cargo, sin obligación.
    - generic [ref=e10]:
      - generic [ref=e11]:
        - generic [ref=e12]: "1"
        - generic [ref=e13]: Tu propiedad
      - generic [ref=e14]:
        - generic [ref=e15]: "2"
        - generic [ref=e16]: Tus datos
      - generic [ref=e17]:
        - generic [ref=e18]: "3"
        - generic [ref=e19]: Resultado
  - generic [ref=e21]:
    - generic [ref=e22]: Tu propiedad
    - generic [ref=e23]: Completá los datos para calcular el valor estimado
    - generic [ref=e24]:
      - generic [ref=e25]: Zona
      - combobox "Zona" [ref=e26]:
        - option "Seleccioná una zona" [selected]
        - option "Nordelta"
        - option "Villanueva"
        - option "Bancalari / Santa Bárbara"
        - option "Delta / Tigre"
    - generic [ref=e27]:
      - generic [ref=e28]: Tipo de propiedad
      - combobox "Tipo de propiedad" [ref=e29]:
        - option "Seleccioná el tipo" [selected]
        - option "Casa"
        - option "Departamento"
        - option "Lote / Terreno"
    - generic [ref=e30]:
      - generic [ref=e31]:
        - generic [ref=e32]: Metros cubiertos (m²)
        - spinbutton "Metros cubiertos" [ref=e33]
      - generic [ref=e34]:
        - generic [ref=e35]: Estado de la propiedad
        - combobox "Estado de la propiedad" [ref=e36]:
          - option "Seleccioná el estado" [selected]
          - option "A nuevo / Estrenar"
          - option "Muy bueno"
          - option "Bueno"
          - option "Regular / A refaccionar"
    - generic [ref=e37]:
      - generic [ref=e38]: ¿Tiene salida directa al agua / canal?
      - generic [ref=e39]:
        - generic [ref=e41] [cursor=pointer]: Sí, tiene
        - generic [ref=e43] [cursor=pointer]: No tiene
    - generic [ref=e44]:
      - generic [ref=e45]: ¿Tiene pileta?
      - generic [ref=e46]:
        - generic [ref=e48] [cursor=pointer]: Sí, tiene
        - generic [ref=e50] [cursor=pointer]: No tiene
    - button "Calcular valor estimado →" [ref=e51] [cursor=pointer]
  - generic [ref=e52]:
    - generic [ref=e53]:
      - generic [ref=e54]: 📍
      - text: Especialistas zona norte
    - generic [ref=e55]:
      - generic [ref=e56]: ⚡
      - text: Respuesta en < 2 hs
    - generic [ref=e57]:
      - generic [ref=e58]: 🔒
      - text: Datos confidenciales
  - contentinfo [ref=e59]:
    - paragraph [ref=e60]: Sitio independiente de búsqueda inmobiliaria · Zona Norte AMBA
```

# Test source

```ts
  893  |     expect(agua.valor).toBeGreaterThan(noAg.valor);
  894  |   });
  895  | 
  896  |   test('10.07 — m²=9999 devuelve resultado válido (no overflow)', async ({ page }) => {
  897  |     await page.goto(URL);
  898  |     const res = await page.evaluate(() => window.__calcular('nordelta', 'casa', 9999, true, 'nuevo', true));
  899  |     expect(res).not.toBeNull();
  900  |     expect(isFinite(res.high)).toBe(true);
  901  |     expect(res.high).toBeGreaterThan(0);
  902  |   });
  903  | 
  904  |   test('10.08 — m²=1 el rango está correctamente calculado', async ({ page }) => {
  905  |     await page.goto(URL);
  906  |     const res = await page.evaluate(() => window.__calcular('nordelta', 'casa', 1, false, 'muybueno', false));
  907  |     expect(res.low).toBe(Math.round(2600 * 0.85));
  908  |     expect(res.high).toBe(Math.round(2600 * 1.15));
  909  |   });
  910  | 
  911  |   test('10.09 — m² decimal (ej: 85.5) funciona correctamente', async ({ page }) => {
  912  |     await page.goto(URL);
  913  |     const res = await page.evaluate(() => window.__calcular('nordelta', 'casa', 85.5, false, 'muybueno', false));
  914  |     expect(res).not.toBeNull();
  915  |     expect(res.valor).toBe(Math.round(85.5 * 2600));
  916  |   });
  917  | 
  918  |   test('10.10 — El más caro posible: Nordelta casa agua nuevo pileta', async ({ page }) => {
  919  |     await page.goto(URL);
  920  |     const res = await page.evaluate(() => window.__calcular('nordelta', 'casa', 500, true, 'nuevo', true));
  921  |     // 500 * 4000 * 1.15 * 1.08 = 2484000
  922  |     expect(res.valor).toBe(Math.round(500 * 4000 * 1.15 * 1.08));
  923  |   });
  924  | 
  925  |   test('10.11 — El más barato posible: Delta casa regular sin extras', async ({ page }) => {
  926  |     await page.goto(URL);
  927  |     const res = await page.evaluate(() => window.__calcular('delta', 'casa', 50, false, 'regular', false));
  928  |     // 50 * 1600 * 0.80 = 64000
  929  |     expect(res.valor).toBe(64000);
  930  |   });
  931  | 
  932  |   test('10.12 — Low siempre < High en 50 combinaciones aleatorias', async ({ page }) => {
  933  |     await page.goto(URL);
  934  |     const zonas  = ['nordelta', 'villanueva', 'bancalari', 'delta'];
  935  |     const tipos  = ['casa', 'dpto', 'lote'];
  936  |     const estados = ['nuevo', 'muybueno', 'bueno', 'regular'];
  937  |     const results = await page.evaluate((z, t, e) => {
  938  |       const combos = [];
  939  |       for (const zona of z) for (const tipo of t) for (const estado of e) {
  940  |         const res = window.__calcular(zona, tipo, 100, true, estado, true);
  941  |         combos.push({ zona, tipo, estado, low: res.low, high: res.high });
  942  |       }
  943  |       return combos;
  944  |     }, zonas, tipos, estados);
  945  |     for (const r of results) {
  946  |       expect(r.low, `${r.zona}/${r.tipo}/${r.estado}`).toBeLessThan(r.high);
  947  |     }
  948  |   });
  949  | });
  950  | 
  951  | // ─────────────────────────────────────────────────────────────────────────────
  952  | // BLOQUE 11: Mobile responsive (8 tests)
  953  | // ─────────────────────────────────────────────────────────────────────────────
  954  | test.describe('Mobile responsive (375px)', () => {
  955  |   test.use({ viewport: { width: 375, height: 812 } });
  956  | 
  957  |   test('11.01 — Página carga en mobile', async ({ page }) => {
  958  |     await page.goto(URL);
  959  |     await expect(page.locator('[data-testid="step-1"]')).toBeVisible();
  960  |   });
  961  | 
  962  |   test('11.02 — Formulario visible en 375px', async ({ page }) => {
  963  |     await page.goto(URL);
  964  |     await expect(page.locator('[data-testid="zona"]')).toBeVisible();
  965  |     await expect(page.locator('[data-testid="tipo"]')).toBeVisible();
  966  |     await expect(page.locator('[data-testid="m2"]')).toBeVisible();
  967  |   });
  968  | 
  969  |   test('11.03 — Botón siguiente accesible en mobile', async ({ page }) => {
  970  |     await page.goto(URL);
  971  |     await expect(page.locator('[data-testid="btn-siguiente-1"]')).toBeVisible();
  972  |   });
  973  | 
  974  |   test('11.04 — Wizard completo funciona en mobile', async ({ page }) => {
  975  |     const { low, high } = await runWizard(page, { zona: 'nordelta', tipo: 'casa', agua: 'si', m2: '100', estado: 'muybueno', pileta: 'no' });
  976  |     expect(low).toBe(340000);
  977  |     expect(high).toBe(460000);
  978  |   });
  979  | 
  980  |   test('11.05 — Resultado visible en mobile', async ({ page }) => {
  981  |     await runWizard(page);
  982  |     await expect(page.locator('[data-testid="result-low"]')).toBeVisible();
  983  |     await expect(page.locator('[data-testid="result-high"]')).toBeVisible();
  984  |   });
  985  | 
  986  |   test('11.06 — WhatsApp CTA visible en mobile', async ({ page }) => {
  987  |     await runWizard(page);
  988  |     await expect(page.locator('[data-testid="btn-whatsapp"]')).toBeVisible();
  989  |   });
  990  | 
  991  |   test('11.07 — Toggles de agua/pileta clickeables en mobile', async ({ page }) => {
  992  |     await page.goto(URL);
> 993  |     await page.check('[data-testid="agua-si"]');
       |                ^ Error: page.check: Test timeout of 15000ms exceeded.
  994  |     await page.check('[data-testid="pileta-si"]');
  995  |     await expect(page.locator('[data-testid="agua-si"]')).toBeChecked();
  996  |     await expect(page.locator('[data-testid="pileta-si"]')).toBeChecked();
  997  |   });
  998  | 
  999  |   test('11.08 — Toggle "no" está por defecto (agua y pileta)', async ({ page }) => {
  1000 |     await page.goto(URL);
  1001 |     await expect(page.locator('[data-testid="agua-no"]')).toBeChecked();
  1002 |     await expect(page.locator('[data-testid="pileta-no"]')).toBeChecked();
  1003 |   });
  1004 | });
  1005 | 
  1006 | // ─────────────────────────────────────────────────────────────────────────────
  1007 | // BLOQUE 12: Tabla de precios base expuesta (6 tests)
  1008 | // ─────────────────────────────────────────────────────────────────────────────
  1009 | test.describe('Tabla de precios base (__PRECIOS)', () => {
  1010 |   test.beforeEach(async ({ page }) => {
  1011 |     await page.goto(URL);
  1012 |   });
  1013 | 
  1014 |   test('12.01 — Nordelta casa al agua = USD 4000/m²', async ({ page }) => {
  1015 |     const p = await page.evaluate(() => window.__PRECIOS.nordelta.casa.agua);
  1016 |     expect(p).toBe(4000);
  1017 |   });
  1018 | 
  1019 |   test('12.02 — Nordelta casa interna = USD 2600/m²', async ({ page }) => {
  1020 |     const p = await page.evaluate(() => window.__PRECIOS.nordelta.casa.noAgua);
  1021 |     expect(p).toBe(2600);
  1022 |   });
  1023 | 
  1024 |   test('12.03 — Nordelta lote al agua = USD 3400/m²', async ({ page }) => {
  1025 |     const p = await page.evaluate(() => window.__PRECIOS.nordelta.lote.agua);
  1026 |     expect(p).toBe(3400);
  1027 |   });
  1028 | 
  1029 |   test('12.04 — Villanueva base = USD 2150/m²', async ({ page }) => {
  1030 |     const p = await page.evaluate(() => window.__PRECIOS.villanueva.casa.agua);
  1031 |     expect(p).toBe(2150);
  1032 |   });
  1033 | 
  1034 |   test('12.05 — Bancalari base = USD 1900/m²', async ({ page }) => {
  1035 |     const p = await page.evaluate(() => window.__PRECIOS.bancalari.casa.noAgua);
  1036 |     expect(p).toBe(1900);
  1037 |   });
  1038 | 
  1039 |   test('12.06 — Delta base = USD 1600/m²', async ({ page }) => {
  1040 |     const p = await page.evaluate(() => window.__PRECIOS.delta.casa.noAgua);
  1041 |     expect(p).toBe(1600);
  1042 |   });
  1043 | });
  1044 | 
  1045 | // ─────────────────────────────────────────────────────────────────────────────
  1046 | // BLOQUE 13: Accesibilidad básica (6 tests)
  1047 | // ─────────────────────────────────────────────────────────────────────────────
  1048 | test.describe('Accesibilidad básica', () => {
  1049 |   test('13.01 — Todos los selects tienen label aria-label o label element', async ({ page }) => {
  1050 |     await page.goto(URL);
  1051 |     const zona   = page.locator('[data-testid="zona"]');
  1052 |     const tipo   = page.locator('[data-testid="tipo"]');
  1053 |     const estado = page.locator('[data-testid="estado"]');
  1054 |     await expect(zona).toHaveAttribute('aria-label');
  1055 |     await expect(tipo).toHaveAttribute('aria-label');
  1056 |     await expect(estado).toHaveAttribute('aria-label');
  1057 |   });
  1058 | 
  1059 |   test('13.02 — Input m² tiene aria-label', async ({ page }) => {
  1060 |     await page.goto(URL);
  1061 |     await expect(page.locator('[data-testid="m2"]')).toHaveAttribute('aria-label');
  1062 |   });
  1063 | 
  1064 |   test('13.03 — Input nombre tiene aria-label', async ({ page }) => {
  1065 |     await page.goto(URL);
  1066 |     await fillStep1(page);
  1067 |     await page.click('[data-testid="btn-siguiente-1"]');
  1068 |     await expect(page.locator('[data-testid="nombre"]')).toHaveAttribute('aria-label');
  1069 |   });
  1070 | 
  1071 |   test('13.04 — Input teléfono tiene aria-label', async ({ page }) => {
  1072 |     await page.goto(URL);
  1073 |     await fillStep1(page);
  1074 |     await page.click('[data-testid="btn-siguiente-1"]');
  1075 |     await expect(page.locator('[data-testid="telefono"]')).toHaveAttribute('aria-label');
  1076 |   });
  1077 | 
  1078 |   test('13.05 — Página tiene meta description', async ({ page }) => {
  1079 |     await page.goto(URL);
  1080 |     const desc = await page.locator('meta[name="description"]').getAttribute('content');
  1081 |     expect(desc).toBeTruthy();
  1082 |     expect(desc.length).toBeGreaterThan(20);
  1083 |   });
  1084 | 
  1085 |   test('13.06 — Página tiene lang="es"', async ({ page }) => {
  1086 |     await page.goto(URL);
  1087 |     const lang = await page.locator('html').getAttribute('lang');
  1088 |     expect(lang).toBe('es');
  1089 |   });
  1090 | });
  1091 | 
```