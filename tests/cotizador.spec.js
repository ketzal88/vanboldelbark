// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

const URL = `file://${path.join(__dirname, '..', 'pretasacion', 'index.html').replace(/\\/g, '/')}`;

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Parse "USD 340.000" → 340000 */
function parseUSD(str) {
  return parseInt(str.replace(/[^0-9]/g, ''), 10);
}

/** Fill step 1 of the cotizador */
async function fillStep1(page, { zona = 'nordelta', tipo = 'casa', m2 = '100', estado = 'muybueno', agua = 'no', pileta = 'no' } = {}) {
  if (zona)   await page.selectOption('[data-testid="zona"]', zona);
  if (tipo)   await page.selectOption('[data-testid="tipo"]', tipo);
  if (m2)     await page.fill('[data-testid="m2"]', m2);
  if (estado) await page.selectOption('[data-testid="estado"]', estado);
  // Radio inputs are visually hidden (CSS toggle UI) — click the visible label
  await page.click(`label[for="agua-${agua}"]`);
  await page.click(`label[for="pileta-${pileta}"]`);
}

/** Fill step 2 of the cotizador */
async function fillStep2(page, { nombre = 'Test Usuario', telefono = '1155555555', email = '', intencion = 'tibio' } = {}) {
  await page.fill('[data-testid="nombre"]', nombre);
  await page.fill('[data-testid="telefono"]', telefono);
  if (email) await page.fill('[data-testid="email"]', email);
  await page.selectOption('[data-testid="intencion"]', intencion);
}

/** Run the full wizard and return parsed result values */
async function runWizard(page, step1Opts, step2Opts) {
  await page.goto(URL);
  await fillStep1(page, step1Opts);
  await page.click('[data-testid="btn-siguiente-1"]');
  await expect(page.locator('[data-testid="step-2"]')).toBeVisible();
  await fillStep2(page, step2Opts);
  await page.click('[data-testid="btn-calcular"]');
  await expect(page.locator('[data-testid="step-3"]')).toBeVisible();
  const low  = parseUSD(await page.locator('[data-testid="result-low"]').textContent());
  const high = parseUSD(await page.locator('[data-testid="result-high"]').textContent());
  return { low, high };
}

/** Mirror of calcular() for expected values in tests */
function expectedCalc(zona, tipo, m2, agua, estado, pileta) {
  const PRECIOS = {
    nordelta:   { casa: { agua: 4000, noAgua: 2600 }, dpto: { agua: 2400, noAgua: 2400 }, lote: { agua: 3400, noAgua: 2200 } },
    villanueva: { casa: { agua: 2150, noAgua: 2150 }, dpto: { agua: 2150, noAgua: 2150 }, lote: { agua: 2150, noAgua: 2150 } },
    bancalari:  { casa: { agua: 1900, noAgua: 1900 }, dpto: { agua: 1900, noAgua: 1900 }, lote: { agua: 1900, noAgua: 1900 } },
    delta:      { casa: { agua: 1600, noAgua: 1600 }, dpto: { agua: 1600, noAgua: 1600 }, lote: { agua: 1600, noAgua: 1600 } }
  };
  const ZONAS_CON_TIER_AGUA = ['nordelta'];
  let ppm2 = agua ? PRECIOS[zona][tipo].agua : PRECIOS[zona][tipo].noAgua;
  if (agua && !ZONAS_CON_TIER_AGUA.includes(zona)) ppm2 *= 1.20;
  let mult = 1;
  if (estado === 'nuevo')   mult *= 1.15;
  if (estado === 'regular') mult *= 0.80;
  if (pileta) mult *= 1.08;
  const valor = m2 * ppm2 * mult;
  return { low: Math.round(valor * 0.85), high: Math.round(valor * 1.15), valor: Math.round(valor) };
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 1: Carga y navegación básica (12 tests)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Navegación y estructura', () => {
  test('1.01 — Carga la página correctamente', async ({ page }) => {
    await page.goto(URL);
    await expect(page).toHaveTitle(/Pretasaci[oó]n/i);
  });

  test('1.02 — Step 1 visible al inicio', async ({ page }) => {
    await page.goto(URL);
    await expect(page.locator('[data-testid="step-1"]')).toBeVisible();
  });

  test('1.03 — Step 2 oculto al inicio', async ({ page }) => {
    await page.goto(URL);
    await expect(page.locator('[data-testid="step-2"]')).toBeHidden();
  });

  test('1.04 — Step 3 oculto al inicio', async ({ page }) => {
    await page.goto(URL);
    await expect(page.locator('[data-testid="step-3"]')).toBeHidden();
  });

  test('1.05 — Ir a step 2 funciona con datos válidos', async ({ page }) => {
    await page.goto(URL);
    await fillStep1(page);
    await page.click('[data-testid="btn-siguiente-1"]');
    await expect(page.locator('[data-testid="step-2"]')).toBeVisible();
    await expect(page.locator('[data-testid="step-1"]')).toBeHidden();
  });

  test('1.06 — Volver desde step 2 a step 1', async ({ page }) => {
    await page.goto(URL);
    await fillStep1(page);
    await page.click('[data-testid="btn-siguiente-1"]');
    await page.click('[data-testid="btn-atras-2"]');
    await expect(page.locator('[data-testid="step-1"]')).toBeVisible();
    await expect(page.locator('[data-testid="step-2"]')).toBeHidden();
  });

  test('1.07 — Valores de step 1 se conservan al volver', async ({ page }) => {
    await page.goto(URL);
    await fillStep1(page, { zona: 'villanueva', tipo: 'lote', m2: '250', estado: 'nuevo' });
    await page.click('[data-testid="btn-siguiente-1"]');
    await page.click('[data-testid="btn-atras-2"]');
    await expect(page.locator('[data-testid="zona"]')).toHaveValue('villanueva');
    await expect(page.locator('[data-testid="tipo"]')).toHaveValue('lote');
    await expect(page.locator('[data-testid="m2"]')).toHaveValue('250');
    await expect(page.locator('[data-testid="estado"]')).toHaveValue('nuevo');
  });

  test('1.08 — Step 3 aparece después de calcular', async ({ page }) => {
    await runWizard(page);
    await expect(page.locator('[data-testid="step-3"]')).toBeVisible();
  });

  test('1.09 — Botón nueva tasación reinicia al paso 1', async ({ page }) => {
    await runWizard(page);
    await page.click('[data-testid="btn-nueva-tasacion"]');
    await expect(page.locator('[data-testid="step-1"]')).toBeVisible();
    await expect(page.locator('[data-testid="step-3"]')).toBeHidden();
  });

  test('1.10 — Reinicio limpia los campos', async ({ page }) => {
    await runWizard(page, { zona: 'bancalari', tipo: 'dpto', m2: '80', estado: 'regular' });
    await page.click('[data-testid="btn-nueva-tasacion"]');
    await expect(page.locator('[data-testid="zona"]')).toHaveValue('');
    await expect(page.locator('[data-testid="tipo"]')).toHaveValue('');
    await expect(page.locator('[data-testid="m2"]')).toHaveValue('');
  });

  test('1.11 — Indicador de pasos existe', async ({ page }) => {
    await page.goto(URL);
    await expect(page.locator('[data-testid="step-indicator"]')).toBeVisible();
  });

  test('1.12 — Header y footer presentes', async ({ page }) => {
    await page.goto(URL);
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 2: Validación paso 1 (15 tests)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Validación — Paso 1', () => {
  test('2.01 — Sin zona muestra error', async ({ page }) => {
    await page.goto(URL);
    await fillStep1(page, { zona: '', tipo: 'casa', m2: '100', estado: 'muybueno' });
    await page.click('[data-testid="btn-siguiente-1"]');
    await expect(page.locator('[data-testid="error-zona"]')).toBeVisible();
    await expect(page.locator('[data-testid="step-1"]')).toBeVisible();
  });

  test('2.02 — Sin tipo muestra error', async ({ page }) => {
    await page.goto(URL);
    await fillStep1(page, { zona: 'nordelta', tipo: '', m2: '100', estado: 'muybueno' });
    await page.click('[data-testid="btn-siguiente-1"]');
    await expect(page.locator('[data-testid="error-tipo"]')).toBeVisible();
  });

  test('2.03 — Sin m² muestra error', async ({ page }) => {
    await page.goto(URL);
    await fillStep1(page, { zona: 'nordelta', tipo: 'casa', m2: '', estado: 'muybueno' });
    await page.click('[data-testid="btn-siguiente-1"]');
    await expect(page.locator('[data-testid="error-m2"]')).toBeVisible();
  });

  test('2.04 — Sin estado muestra error', async ({ page }) => {
    await page.goto(URL);
    await fillStep1(page, { zona: 'nordelta', tipo: 'casa', m2: '100', estado: '' });
    await page.click('[data-testid="btn-siguiente-1"]');
    await expect(page.locator('[data-testid="error-estado"]')).toBeVisible();
  });

  test('2.05 — m²=0 muestra error', async ({ page }) => {
    await page.goto(URL);
    await fillStep1(page, { zona: 'nordelta', tipo: 'casa', m2: '0', estado: 'muybueno' });
    await page.click('[data-testid="btn-siguiente-1"]');
    await expect(page.locator('[data-testid="error-m2"]')).toBeVisible();
  });

  test('2.06 — m² negativo muestra error', async ({ page }) => {
    await page.goto(URL);
    await fillStep1(page, { zona: 'nordelta', tipo: 'casa', m2: '-50', estado: 'muybueno' });
    await page.click('[data-testid="btn-siguiente-1"]');
    await expect(page.locator('[data-testid="error-m2"]')).toBeVisible();
  });

  test('2.07 — Todos los errores a la vez (form vacío)', async ({ page }) => {
    await page.goto(URL);
    await page.click('[data-testid="btn-siguiente-1"]');
    await expect(page.locator('[data-testid="error-zona"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-tipo"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-m2"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-estado"]')).toBeVisible();
  });

  test('2.08 — Error desaparece al completar campo', async ({ page }) => {
    await page.goto(URL);
    await page.click('[data-testid="btn-siguiente-1"]');
    await expect(page.locator('[data-testid="error-zona"]')).toBeVisible();
    await page.selectOption('[data-testid="zona"]', 'nordelta');
    await page.click('[data-testid="btn-siguiente-1"]');
    await expect(page.locator('[data-testid="error-zona"]')).toBeHidden();
  });

  test('2.09 — Zona "nordelta" es válida', async ({ page }) => {
    await page.goto(URL);
    await fillStep1(page, { zona: 'nordelta' });
    await page.click('[data-testid="btn-siguiente-1"]');
    await expect(page.locator('[data-testid="error-zona"]')).toBeHidden();
  });

  test('2.10 — Zona "villanueva" es válida', async ({ page }) => {
    await page.goto(URL);
    await fillStep1(page, { zona: 'villanueva' });
    await page.click('[data-testid="btn-siguiente-1"]');
    await expect(page.locator('[data-testid="error-zona"]')).toBeHidden();
  });

  test('2.11 — Zona "bancalari" es válida', async ({ page }) => {
    await page.goto(URL);
    await fillStep1(page, { zona: 'bancalari' });
    await page.click('[data-testid="btn-siguiente-1"]');
    await expect(page.locator('[data-testid="error-zona"]')).toBeHidden();
  });

  test('2.12 — Zona "delta" es válida', async ({ page }) => {
    await page.goto(URL);
    await fillStep1(page, { zona: 'delta' });
    await page.click('[data-testid="btn-siguiente-1"]');
    await expect(page.locator('[data-testid="error-zona"]')).toBeHidden();
  });

  test('2.13 — Estado "nuevo" es válido', async ({ page }) => {
    await page.goto(URL);
    await fillStep1(page, { estado: 'nuevo' });
    await page.click('[data-testid="btn-siguiente-1"]');
    await expect(page.locator('[data-testid="error-estado"]')).toBeHidden();
  });

  test('2.14 — Estado "regular" es válido', async ({ page }) => {
    await page.goto(URL);
    await fillStep1(page, { estado: 'regular' });
    await page.click('[data-testid="btn-siguiente-1"]');
    await expect(page.locator('[data-testid="error-estado"]')).toBeHidden();
  });

  test('2.15 — No avanza sin datos aunque agua/pileta estén seleccionados', async ({ page }) => {
    await page.goto(URL);
    await page.click('label[for="agua-si"]');
    await page.click('label[for="pileta-si"]');
    await page.click('[data-testid="btn-siguiente-1"]');
    await expect(page.locator('[data-testid="step-1"]')).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 3: Validación paso 2 (10 tests)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Validación — Paso 2', () => {
  test('3.01 — Sin nombre muestra error', async ({ page }) => {
    await page.goto(URL);
    await fillStep1(page);
    await page.click('[data-testid="btn-siguiente-1"]');
    await fillStep2(page, { nombre: '', telefono: '1155555555', intencion: 'tibio' });
    await page.click('[data-testid="btn-calcular"]');
    await expect(page.locator('[data-testid="error-nombre"]')).toBeVisible();
    await expect(page.locator('[data-testid="step-3"]')).toBeHidden();
  });

  test('3.02 — Sin teléfono muestra error', async ({ page }) => {
    await page.goto(URL);
    await fillStep1(page);
    await page.click('[data-testid="btn-siguiente-1"]');
    await fillStep2(page, { nombre: 'Juan', telefono: '', intencion: 'tibio' });
    await page.click('[data-testid="btn-calcular"]');
    await expect(page.locator('[data-testid="error-telefono"]')).toBeVisible();
  });

  test('3.03 — Sin intención muestra error', async ({ page }) => {
    await page.goto(URL);
    await fillStep1(page);
    await page.click('[data-testid="btn-siguiente-1"]');
    await fillStep2(page, { nombre: 'Juan', telefono: '1155555555', intencion: '' });
    await page.click('[data-testid="btn-calcular"]');
    await expect(page.locator('[data-testid="error-intencion"]')).toBeVisible();
  });

  test('3.04 — Email es opcional (sin email funciona)', async ({ page }) => {
    await page.goto(URL);
    await fillStep1(page);
    await page.click('[data-testid="btn-siguiente-1"]');
    await fillStep2(page, { nombre: 'Juan', telefono: '1155555555', email: '', intencion: 'caliente' });
    await page.click('[data-testid="btn-calcular"]');
    await expect(page.locator('[data-testid="step-3"]')).toBeVisible();
  });

  test('3.05 — Form vacío en paso 2 muestra todos los errores', async ({ page }) => {
    await page.goto(URL);
    await fillStep1(page);
    await page.click('[data-testid="btn-siguiente-1"]');
    await page.click('[data-testid="btn-calcular"]');
    await expect(page.locator('[data-testid="error-nombre"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-telefono"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-intencion"]')).toBeVisible();
  });

  test('3.06 — Intención "caliente" es válida', async ({ page }) => {
    await page.goto(URL);
    await fillStep1(page);
    await page.click('[data-testid="btn-siguiente-1"]');
    await fillStep2(page, { intencion: 'caliente' });
    await page.click('[data-testid="btn-calcular"]');
    await expect(page.locator('[data-testid="step-3"]')).toBeVisible();
  });

  test('3.07 — Intención "tibio" es válida', async ({ page }) => {
    await page.goto(URL);
    await fillStep1(page);
    await page.click('[data-testid="btn-siguiente-1"]');
    await fillStep2(page, { intencion: 'tibio' });
    await page.click('[data-testid="btn-calcular"]');
    await expect(page.locator('[data-testid="step-3"]')).toBeVisible();
  });

  test('3.08 — Intención "frio" es válida', async ({ page }) => {
    await page.goto(URL);
    await fillStep1(page);
    await page.click('[data-testid="btn-siguiente-1"]');
    await fillStep2(page, { intencion: 'frio' });
    await page.click('[data-testid="btn-calcular"]');
    await expect(page.locator('[data-testid="step-3"]')).toBeVisible();
  });

  test('3.09 — Nombre con solo espacios muestra error', async ({ page }) => {
    await page.goto(URL);
    await fillStep1(page);
    await page.click('[data-testid="btn-siguiente-1"]');
    await fillStep2(page, { nombre: '   ', telefono: '1155555555', intencion: 'tibio' });
    await page.click('[data-testid="btn-calcular"]');
    await expect(page.locator('[data-testid="error-nombre"]')).toBeVisible();
  });

  test('3.10 — Con email válido funciona correctamente', async ({ page }) => {
    await page.goto(URL);
    await fillStep1(page);
    await page.click('[data-testid="btn-siguiente-1"]');
    await fillStep2(page, { nombre: 'Ana García', telefono: '1155555555', email: 'ana@test.com', intencion: 'tibio' });
    await page.click('[data-testid="btn-calcular"]');
    await expect(page.locator('[data-testid="step-3"]')).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 4: Lógica de cálculo — zonas y tipos (via window.__calcular)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Cálculo — función pura (window.__calcular)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  // ── 4.1 Nordelta ──
  test('4.01 — Nordelta casa al agua base correcta', async ({ page }) => {
    const res = await page.evaluate(() => window.__calcular('nordelta', 'casa', 100, true, 'muybueno', false));
    const exp = expectedCalc('nordelta', 'casa', 100, true, 'muybueno', false);
    expect(res.low).toBe(exp.low);
    expect(res.high).toBe(exp.high);
    expect(res.low).toBe(340000);
    expect(res.high).toBe(460000);
  });

  test('4.02 — Nordelta casa interna base correcta', async ({ page }) => {
    const res = await page.evaluate(() => window.__calcular('nordelta', 'casa', 100, false, 'muybueno', false));
    expect(res.low).toBe(221000);
    expect(res.high).toBe(299000);
  });

  test('4.03 — Nordelta lote al agua base correcta', async ({ page }) => {
    const res = await page.evaluate(() => window.__calcular('nordelta', 'lote', 100, true, 'muybueno', false));
    expect(res.low).toBe(289000);
    expect(res.high).toBe(391000);
  });

  test('4.04 — Nordelta lote interno base correcta', async ({ page }) => {
    const res = await page.evaluate(() => window.__calcular('nordelta', 'lote', 100, false, 'muybueno', false));
    expect(res.low).toBe(187000);
    expect(res.high).toBe(253000);
  });

  test('4.05 — Nordelta dpto base correcta', async ({ page }) => {
    const res = await page.evaluate(() => window.__calcular('nordelta', 'dpto', 100, false, 'muybueno', false));
    expect(res.low).toBe(204000);
    expect(res.high).toBe(276000);
  });

  test('4.06 — Nordelta dpto agua no cambia la base (misma tier)', async ({ page }) => {
    const sinAgua = await page.evaluate(() => window.__calcular('nordelta', 'dpto', 100, false, 'muybueno', false));
    const conAgua = await page.evaluate(() => window.__calcular('nordelta', 'dpto', 100, true, 'muybueno', false));
    // Nordelta dpto tiene agua=noAgua=2400, así que NO debe haber diferencia adicional
    expect(sinAgua.low).toBe(conAgua.low);
    expect(sinAgua.high).toBe(conAgua.high);
  });

  // ── 4.2 Villanueva ──
  test('4.07 — Villanueva casa sin agua base correcta', async ({ page }) => {
    const res = await page.evaluate(() => window.__calcular('villanueva', 'casa', 100, false, 'muybueno', false));
    expect(res.low).toBe(182750);
    expect(res.high).toBe(247250);
  });

  test('4.08 — Villanueva casa al agua suma 20%', async ({ page }) => {
    const sinAgua = await page.evaluate(() => window.__calcular('villanueva', 'casa', 100, false, 'muybueno', false));
    const conAgua = await page.evaluate(() => window.__calcular('villanueva', 'casa', 100, true, 'muybueno', false));
    // Agua debe agregar +20%
    expect(conAgua.valor).toBe(Math.round(sinAgua.valor * 1.20));
  });

  test('4.09 — Villanueva lote sin agua correcto', async ({ page }) => {
    const res = await page.evaluate(() => window.__calcular('villanueva', 'lote', 100, false, 'muybueno', false));
    const exp = expectedCalc('villanueva', 'lote', 100, false, 'muybueno', false);
    expect(res.low).toBe(exp.low);
    expect(res.high).toBe(exp.high);
  });

  test('4.10 — Villanueva dpto correcto', async ({ page }) => {
    const res = await page.evaluate(() => window.__calcular('villanueva', 'dpto', 100, false, 'muybueno', false));
    const exp = expectedCalc('villanueva', 'dpto', 100, false, 'muybueno', false);
    expect(res.low).toBe(exp.low);
    expect(res.high).toBe(exp.high);
  });

  // ── 4.3 Bancalari ──
  test('4.11 — Bancalari casa sin agua base correcta', async ({ page }) => {
    const res = await page.evaluate(() => window.__calcular('bancalari', 'casa', 100, false, 'muybueno', false));
    expect(res.low).toBe(161500);
    expect(res.high).toBe(218500);
  });

  test('4.12 — Bancalari casa al agua suma 20%', async ({ page }) => {
    const sinAgua = await page.evaluate(() => window.__calcular('bancalari', 'casa', 100, false, 'muybueno', false));
    const conAgua = await page.evaluate(() => window.__calcular('bancalari', 'casa', 100, true, 'muybueno', false));
    expect(conAgua.valor).toBe(Math.round(sinAgua.valor * 1.20));
  });

  test('4.13 — Bancalari lote correcto', async ({ page }) => {
    const res = await page.evaluate(() => window.__calcular('bancalari', 'lote', 100, false, 'muybueno', false));
    const exp = expectedCalc('bancalari', 'lote', 100, false, 'muybueno', false);
    expect(res.low).toBe(exp.low);
  });

  test('4.14 — Bancalari dpto correcto', async ({ page }) => {
    const res = await page.evaluate(() => window.__calcular('bancalari', 'dpto', 100, false, 'muybueno', false));
    const exp = expectedCalc('bancalari', 'dpto', 100, false, 'muybueno', false);
    expect(res.low).toBe(exp.low);
  });

  // ── 4.4 Delta ──
  test('4.15 — Delta casa sin agua base correcta', async ({ page }) => {
    const res = await page.evaluate(() => window.__calcular('delta', 'casa', 100, false, 'muybueno', false));
    expect(res.low).toBe(136000);
    expect(res.high).toBe(184000);
  });

  test('4.16 — Delta casa al agua suma 20%', async ({ page }) => {
    const sinAgua = await page.evaluate(() => window.__calcular('delta', 'casa', 100, false, 'muybueno', false));
    const conAgua = await page.evaluate(() => window.__calcular('delta', 'casa', 100, true, 'muybueno', false));
    expect(conAgua.valor).toBe(Math.round(sinAgua.valor * 1.20));
  });

  test('4.17 — Delta lote correcto', async ({ page }) => {
    const res = await page.evaluate(() => window.__calcular('delta', 'lote', 100, false, 'muybueno', false));
    const exp = expectedCalc('delta', 'lote', 100, false, 'muybueno', false);
    expect(res.low).toBe(exp.low);
  });

  test('4.18 — Delta dpto correcto', async ({ page }) => {
    const res = await page.evaluate(() => window.__calcular('delta', 'dpto', 100, false, 'muybueno', false));
    const exp = expectedCalc('delta', 'dpto', 100, false, 'muybueno', false);
    expect(res.low).toBe(exp.low);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 5: Ajuste de estado (12 tests)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Cálculo — ajustes de estado', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test('5.01 — Estado "nuevo" suma exactamente 15%', async ({ page }) => {
    const base  = await page.evaluate(() => window.__calcular('nordelta', 'casa', 100, false, 'muybueno', false));
    const nuevo = await page.evaluate(() => window.__calcular('nordelta', 'casa', 100, false, 'nuevo', false));
    expect(nuevo.valor).toBe(Math.round(base.valor * 1.15));
  });

  test('5.02 — Estado "regular" resta exactamente 20%', async ({ page }) => {
    const base    = await page.evaluate(() => window.__calcular('nordelta', 'casa', 100, false, 'muybueno', false));
    const regular = await page.evaluate(() => window.__calcular('nordelta', 'casa', 100, false, 'regular', false));
    expect(regular.valor).toBe(Math.round(base.valor * 0.80));
  });

  test('5.03 — Estado "bueno" igual a "muybueno" (sin ajuste)', async ({ page }) => {
    const muybueno = await page.evaluate(() => window.__calcular('nordelta', 'casa', 100, false, 'muybueno', false));
    const bueno    = await page.evaluate(() => window.__calcular('nordelta', 'casa', 100, false, 'bueno', false));
    expect(muybueno.low).toBe(bueno.low);
    expect(muybueno.high).toBe(bueno.high);
  });

  test('5.04 — nuevo > muybueno > regular', async ({ page }) => {
    const nuevo   = await page.evaluate(() => window.__calcular('nordelta', 'casa', 100, false, 'nuevo', false));
    const muyb    = await page.evaluate(() => window.__calcular('nordelta', 'casa', 100, false, 'muybueno', false));
    const regular = await page.evaluate(() => window.__calcular('nordelta', 'casa', 100, false, 'regular', false));
    expect(nuevo.valor).toBeGreaterThan(muyb.valor);
    expect(muyb.valor).toBeGreaterThan(regular.valor);
  });

  test('5.05 — Ajuste "nuevo" funciona en Villanueva', async ({ page }) => {
    const base  = await page.evaluate(() => window.__calcular('villanueva', 'casa', 100, false, 'muybueno', false));
    const nuevo = await page.evaluate(() => window.__calcular('villanueva', 'casa', 100, false, 'nuevo', false));
    expect(nuevo.valor).toBe(Math.round(base.valor * 1.15));
  });

  test('5.06 — Ajuste "regular" funciona en Bancalari', async ({ page }) => {
    const base    = await page.evaluate(() => window.__calcular('bancalari', 'casa', 100, false, 'muybueno', false));
    const regular = await page.evaluate(() => window.__calcular('bancalari', 'casa', 100, false, 'regular', false));
    expect(regular.valor).toBe(Math.round(base.valor * 0.80));
  });

  test('5.07 — Ajuste "nuevo" funciona en Delta', async ({ page }) => {
    const base  = await page.evaluate(() => window.__calcular('delta', 'lote', 200, false, 'muybueno', false));
    const nuevo = await page.evaluate(() => window.__calcular('delta', 'lote', 200, false, 'nuevo', false));
    expect(nuevo.valor).toBe(Math.round(base.valor * 1.15));
  });

  test('5.08 — Ajuste "regular" funciona en Villanueva dpto', async ({ page }) => {
    const base    = await page.evaluate(() => window.__calcular('villanueva', 'dpto', 60, false, 'muybueno', false));
    const regular = await page.evaluate(() => window.__calcular('villanueva', 'dpto', 60, false, 'regular', false));
    expect(regular.valor).toBe(Math.round(base.valor * 0.80));
  });

  test('5.09 — Nuevo + agua: ambos ajustes se acumulan', async ({ page }) => {
    const base = await page.evaluate(() => window.__calcular('villanueva', 'casa', 100, false, 'muybueno', false));
    const full = await page.evaluate(() => window.__calcular('villanueva', 'casa', 100, true, 'nuevo', false));
    expect(full.valor).toBe(Math.round(base.valor * 1.20 * 1.15));
  });

  test('5.10 — Regular + agua: ambos ajustes se acumulan', async ({ page }) => {
    const base = await page.evaluate(() => window.__calcular('delta', 'casa', 100, false, 'muybueno', false));
    const full = await page.evaluate(() => window.__calcular('delta', 'casa', 100, true, 'regular', false));
    expect(full.valor).toBe(Math.round(base.valor * 1.20 * 0.80));
  });

  test('5.11 — Nuevo + pileta se acumulan correctamente', async ({ page }) => {
    const base = await page.evaluate(() => window.__calcular('nordelta', 'casa', 100, false, 'muybueno', false));
    const full = await page.evaluate(() => window.__calcular('nordelta', 'casa', 100, false, 'nuevo', true));
    expect(full.valor).toBe(Math.round(base.valor * 1.15 * 1.08));
  });

  test('5.12 — Regular + pileta se acumulan correctamente', async ({ page }) => {
    const base = await page.evaluate(() => window.__calcular('nordelta', 'casa', 100, false, 'muybueno', false));
    const full = await page.evaluate(() => window.__calcular('nordelta', 'casa', 100, false, 'regular', true));
    expect(full.valor).toBe(Math.round(base.valor * 0.80 * 1.08));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 6: Ajuste pileta (8 tests)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Cálculo — ajuste pileta', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test('6.01 — Pileta suma exactamente 8%', async ({ page }) => {
    const sin = await page.evaluate(() => window.__calcular('nordelta', 'casa', 100, false, 'muybueno', false));
    const con = await page.evaluate(() => window.__calcular('nordelta', 'casa', 100, false, 'muybueno', true));
    expect(con.valor).toBe(Math.round(sin.valor * 1.08));
  });

  test('6.02 — Pileta en Villanueva suma 8%', async ({ page }) => {
    const sin = await page.evaluate(() => window.__calcular('villanueva', 'casa', 150, false, 'muybueno', false));
    const con = await page.evaluate(() => window.__calcular('villanueva', 'casa', 150, false, 'muybueno', true));
    expect(con.valor).toBe(Math.round(sin.valor * 1.08));
  });

  test('6.03 — Pileta en Bancalari suma 8%', async ({ page }) => {
    const sin = await page.evaluate(() => window.__calcular('bancalari', 'casa', 100, false, 'bueno', false));
    const con = await page.evaluate(() => window.__calcular('bancalari', 'casa', 100, false, 'bueno', true));
    expect(con.valor).toBe(Math.round(sin.valor * 1.08));
  });

  test('6.04 — Pileta en Delta suma 8%', async ({ page }) => {
    const sin = await page.evaluate(() => window.__calcular('delta', 'casa', 200, false, 'nuevo', false));
    const con = await page.evaluate(() => window.__calcular('delta', 'casa', 200, false, 'nuevo', true));
    expect(con.valor).toBe(Math.round(sin.valor * 1.08));
  });

  test('6.05 — Sin pileta ≠ con pileta (valor diferente)', async ({ page }) => {
    const sin = await page.evaluate(() => window.__calcular('nordelta', 'casa', 100, false, 'muybueno', false));
    const con = await page.evaluate(() => window.__calcular('nordelta', 'casa', 100, false, 'muybueno', true));
    expect(con.valor).not.toBe(sin.valor);
  });

  test('6.06 — Pileta + agua en Villanueva se acumulan multiplicativamente', async ({ page }) => {
    const base = await page.evaluate(() => window.__calcular('villanueva', 'casa', 100, false, 'muybueno', false));
    const full = await page.evaluate(() => window.__calcular('villanueva', 'casa', 100, true, 'muybueno', true));
    expect(full.valor).toBe(Math.round(base.valor * 1.20 * 1.08));
  });

  test('6.07 — Todo junto (nuevo + agua + pileta) en Villanueva', async ({ page }) => {
    const base = await page.evaluate(() => window.__calcular('villanueva', 'casa', 100, false, 'muybueno', false));
    const full = await page.evaluate(() => window.__calcular('villanueva', 'casa', 100, true, 'nuevo', true));
    expect(full.valor).toBe(Math.round(base.valor * 1.20 * 1.15 * 1.08));
  });

  test('6.08 — Todo junto (regular + agua + pileta) en Delta', async ({ page }) => {
    const base = await page.evaluate(() => window.__calcular('delta', 'casa', 100, false, 'muybueno', false));
    const full = await page.evaluate(() => window.__calcular('delta', 'casa', 100, true, 'regular', true));
    expect(full.valor).toBe(Math.round(base.valor * 1.20 * 0.80 * 1.08));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 7: Escala lineal con m² (10 tests)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Cálculo — escala de metros cuadrados', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test('7.01 — 200m² = exactamente 2× que 100m²', async ({ page }) => {
    const c100 = await page.evaluate(() => window.__calcular('nordelta', 'casa', 100, false, 'muybueno', false));
    const c200 = await page.evaluate(() => window.__calcular('nordelta', 'casa', 200, false, 'muybueno', false));
    expect(c200.valor).toBe(c100.valor * 2);
  });

  test('7.02 — 50m² = exactamente 0.5× que 100m²', async ({ page }) => {
    const c50  = await page.evaluate(() => window.__calcular('nordelta', 'casa', 50, false, 'muybueno', false));
    const c100 = await page.evaluate(() => window.__calcular('nordelta', 'casa', 100, false, 'muybueno', false));
    expect(c50.valor * 2).toBe(c100.valor);
  });

  test('7.03 — 300m² = 3× que 100m² (Villanueva)', async ({ page }) => {
    const c100 = await page.evaluate(() => window.__calcular('villanueva', 'casa', 100, false, 'muybueno', false));
    const c300 = await page.evaluate(() => window.__calcular('villanueva', 'casa', 300, false, 'muybueno', false));
    expect(c300.valor).toBe(c100.valor * 3);
  });

  test('7.04 — 1m² devuelve resultado positivo', async ({ page }) => {
    const res = await page.evaluate(() => window.__calcular('nordelta', 'casa', 1, false, 'muybueno', false));
    expect(res).not.toBeNull();
    expect(res.low).toBeGreaterThan(0);
  });

  test('7.05 — 500m² devuelve resultado positivo', async ({ page }) => {
    const res = await page.evaluate(() => window.__calcular('nordelta', 'casa', 500, false, 'muybueno', false));
    expect(res).not.toBeNull();
    expect(res.high).toBeGreaterThan(0);
  });

  test('7.06 — 1000m² funciona correctamente', async ({ page }) => {
    const res = await page.evaluate(() => window.__calcular('nordelta', 'casa', 1000, false, 'muybueno', false));
    expect(res).not.toBeNull();
    expect(res.valor).toBe(2600000);
  });

  test('7.07 — m²=0 retorna null', async ({ page }) => {
    const res = await page.evaluate(() => window.__calcular('nordelta', 'casa', 0, false, 'muybueno', false));
    expect(res).toBeNull();
  });

  test('7.08 — m² negativo retorna null', async ({ page }) => {
    const res = await page.evaluate(() => window.__calcular('nordelta', 'casa', -10, false, 'muybueno', false));
    expect(res).toBeNull();
  });

  test('7.09 — Low es siempre 85% del valor central', async ({ page }) => {
    const res = await page.evaluate(() => window.__calcular('bancalari', 'casa', 120, false, 'nuevo', true));
    expect(res.low).toBe(Math.round(res.valor * 0.85));
  });

  test('7.10 — High es siempre 115% del valor central', async ({ page }) => {
    const res = await page.evaluate(() => window.__calcular('delta', 'lote', 80, true, 'regular', false));
    expect(res.high).toBe(Math.round(res.valor * 1.15));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 8: Resultado visible en UI (15 tests vía wizard completo)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Resultado — visualización en UI', () => {
  test('8.01 — Low y High aparecen en pantalla', async ({ page }) => {
    await runWizard(page);
    await expect(page.locator('[data-testid="result-low"]')).toBeVisible();
    await expect(page.locator('[data-testid="result-high"]')).toBeVisible();
  });

  test('8.02 — Valores muestran "USD"', async ({ page }) => {
    await runWizard(page);
    const low  = await page.locator('[data-testid="result-low"]').textContent();
    const high = await page.locator('[data-testid="result-high"]').textContent();
    expect(low).toContain('USD');
    expect(high).toContain('USD');
  });

  test('8.03 — Low es menor que High', async ({ page }) => {
    const { low, high } = await runWizard(page, { m2: '150' });
    expect(low).toBeLessThan(high);
  });

  test('8.04 — Nombre de zona aparece en resultado (Nordelta)', async ({ page }) => {
    await runWizard(page, { zona: 'nordelta' });
    const zonaEl = await page.locator('[data-testid="result-zona-nombre"]').textContent();
    expect(zonaEl).toContain('Nordelta');
  });

  test('8.05 — Nombre de zona aparece en resultado (Villanueva)', async ({ page }) => {
    await runWizard(page, { zona: 'villanueva' });
    const zonaEl = await page.locator('[data-testid="result-zona-nombre"]').textContent();
    expect(zonaEl).toContain('Villanueva');
  });

  test('8.06 — Nombre de zona aparece en resultado (Bancalari)', async ({ page }) => {
    await runWizard(page, { zona: 'bancalari' });
    const zonaEl = await page.locator('[data-testid="result-zona-nombre"]').textContent();
    expect(zonaEl).toContain('Bancalari');
  });

  test('8.07 — Nombre de zona aparece en resultado (Delta)', async ({ page }) => {
    await runWizard(page, { zona: 'delta' });
    const zonaEl = await page.locator('[data-testid="result-zona-nombre"]').textContent();
    expect(zonaEl).toContain('Delta');
  });

  test('8.08 — Valores UI coinciden con cálculo esperado (Nordelta casa agua)', async ({ page }) => {
    const { low, high } = await runWizard(page, { zona: 'nordelta', tipo: 'casa', agua: 'si', m2: '100', estado: 'muybueno', pileta: 'no' });
    expect(low).toBe(340000);
    expect(high).toBe(460000);
  });

  test('8.09 — Valores UI coinciden con cálculo esperado (Bancalari casa regular)', async ({ page }) => {
    const { low, high } = await runWizard(page, { zona: 'bancalari', tipo: 'casa', agua: 'no', m2: '100', estado: 'regular', pileta: 'no' });
    const exp = expectedCalc('bancalari', 'casa', 100, false, 'regular', false);
    expect(low).toBe(exp.low);
    expect(high).toBe(exp.high);
  });

  test('8.10 — Valores UI coinciden (Delta lote al agua)', async ({ page }) => {
    const { low, high } = await runWizard(page, { zona: 'delta', tipo: 'lote', agua: 'si', m2: '200', estado: 'bueno', pileta: 'no' });
    const exp = expectedCalc('delta', 'lote', 200, true, 'bueno', false);
    expect(low).toBe(exp.low);
    expect(high).toBe(exp.high);
  });

  test('8.11 — Valores UI coinciden (Nordelta dpto nuevo con pileta)', async ({ page }) => {
    const { low, high } = await runWizard(page, { zona: 'nordelta', tipo: 'dpto', agua: 'no', m2: '80', estado: 'nuevo', pileta: 'si' });
    const exp = expectedCalc('nordelta', 'dpto', 80, false, 'nuevo', true);
    expect(low).toBe(exp.low);
    expect(high).toBe(exp.high);
  });

  test('8.12 — m² se muestra en resumen de resultado', async ({ page }) => {
    await runWizard(page, { m2: '175' });
    const m2el = await page.locator('[data-testid="result-m2-val"]').textContent();
    expect(m2el).toContain('175');
  });

  test('8.13 — Estado se muestra en resumen', async ({ page }) => {
    await runWizard(page, { estado: 'nuevo' });
    const estadoEl = await page.locator('[data-testid="result-estado-val"]').textContent();
    expect(estadoEl).toBeTruthy();
    expect(estadoEl.length).toBeGreaterThan(0);
  });

  test('8.14 — Extras muestran "Al agua" cuando aplica', async ({ page }) => {
    await runWizard(page, { agua: 'si', pileta: 'no' });
    const extras = await page.locator('[data-testid="result-extras-val"]').textContent();
    expect(extras).toContain('Al agua');
  });

  test('8.15 — Extras muestran "Pileta" cuando aplica', async ({ page }) => {
    await runWizard(page, { agua: 'no', pileta: 'si' });
    const extras = await page.locator('[data-testid="result-extras-val"]').textContent();
    expect(extras).toContain('Pileta');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 9: CTA WhatsApp y botones (8 tests)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('CTA y botones', () => {
  test('9.01 — Botón WhatsApp existe en resultado', async ({ page }) => {
    await runWizard(page);
    await expect(page.locator('[data-testid="btn-whatsapp"]')).toBeVisible();
  });

  test('9.02 — Botón WhatsApp tiene href con wa.me', async ({ page }) => {
    await runWizard(page);
    const href = await page.locator('[data-testid="btn-whatsapp"]').getAttribute('href');
    expect(href).toContain('wa.me');
  });

  test('9.03 — Botón WhatsApp tiene href con texto de resultado', async ({ page }) => {
    await runWizard(page, { zona: 'nordelta', tipo: 'casa', agua: 'si', m2: '100', estado: 'muybueno', pileta: 'no' });
    const href = await page.locator('[data-testid="btn-whatsapp"]').getAttribute('href');
    expect(href).toContain('text=');
  });

  test('9.04 — Botón WhatsApp tiene target _blank', async ({ page }) => {
    await runWizard(page);
    const target = await page.locator('[data-testid="btn-whatsapp"]').getAttribute('target');
    expect(target).toBe('_blank');
  });

  test('9.05 — Botón "nueva tasación" existe en resultado', async ({ page }) => {
    await runWizard(page);
    await expect(page.locator('[data-testid="btn-nueva-tasacion"]')).toBeVisible();
  });

  test('9.06 — "Nueva tasación" lleva a paso 1', async ({ page }) => {
    await runWizard(page);
    await page.click('[data-testid="btn-nueva-tasacion"]');
    await expect(page.locator('[data-testid="step-1"]')).toBeVisible();
  });

  test('9.07 — "Nueva tasación" limpia el campo zona', async ({ page }) => {
    await runWizard(page, { zona: 'bancalari' });
    await page.click('[data-testid="btn-nueva-tasacion"]');
    await expect(page.locator('[data-testid="zona"]')).toHaveValue('');
  });

  test('9.08 — "Nueva tasación" limpia el campo m²', async ({ page }) => {
    await runWizard(page, { m2: '999' });
    await page.click('[data-testid="btn-nueva-tasacion"]');
    await expect(page.locator('[data-testid="m2"]')).toHaveValue('');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 10: Casos especiales y edge cases (12 tests)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Edge cases y casos especiales', () => {
  test('10.01 — Zona inválida retorna null', async ({ page }) => {
    await page.goto(URL);
    const res = await page.evaluate(() => window.__calcular('bogota', 'casa', 100, false, 'muybueno', false));
    expect(res).toBeNull();
  });

  test('10.02 — Tipo inválido retorna null', async ({ page }) => {
    await page.goto(URL);
    const res = await page.evaluate(() => window.__calcular('nordelta', 'garaje', 100, false, 'muybueno', false));
    expect(res).toBeNull();
  });

  test('10.03 — Nordelta casa más cara que Delta casa (mismos inputs)', async ({ page }) => {
    await page.goto(URL);
    const nordelta = await page.evaluate(() => window.__calcular('nordelta', 'casa', 100, true, 'muybueno', false));
    const delta    = await page.evaluate(() => window.__calcular('delta', 'casa', 100, true, 'muybueno', false));
    expect(nordelta.valor).toBeGreaterThan(delta.valor);
  });

  test('10.04 — Nordelta > Villanueva > Bancalari > Delta (precios base)', async ({ page }) => {
    await page.goto(URL);
    const n = await page.evaluate(() => window.__calcular('nordelta', 'casa', 100, false, 'muybueno', false));
    const v = await page.evaluate(() => window.__calcular('villanueva', 'casa', 100, false, 'muybueno', false));
    const b = await page.evaluate(() => window.__calcular('bancalari', 'casa', 100, false, 'muybueno', false));
    const d = await page.evaluate(() => window.__calcular('delta', 'casa', 100, false, 'muybueno', false));
    expect(n.valor).toBeGreaterThan(v.valor);
    expect(v.valor).toBeGreaterThan(b.valor);
    expect(b.valor).toBeGreaterThan(d.valor);
  });

  test('10.05 — Casa al agua Nordelta > Casa interna Nordelta', async ({ page }) => {
    await page.goto(URL);
    const agua  = await page.evaluate(() => window.__calcular('nordelta', 'casa', 100, true, 'muybueno', false));
    const noAg  = await page.evaluate(() => window.__calcular('nordelta', 'casa', 100, false, 'muybueno', false));
    expect(agua.valor).toBeGreaterThan(noAg.valor);
  });

  test('10.06 — Nordelta lote al agua > lote interno', async ({ page }) => {
    await page.goto(URL);
    const agua  = await page.evaluate(() => window.__calcular('nordelta', 'lote', 100, true, 'muybueno', false));
    const noAg  = await page.evaluate(() => window.__calcular('nordelta', 'lote', 100, false, 'muybueno', false));
    expect(agua.valor).toBeGreaterThan(noAg.valor);
  });

  test('10.07 — m²=9999 devuelve resultado válido (no overflow)', async ({ page }) => {
    await page.goto(URL);
    const res = await page.evaluate(() => window.__calcular('nordelta', 'casa', 9999, true, 'nuevo', true));
    expect(res).not.toBeNull();
    expect(isFinite(res.high)).toBe(true);
    expect(res.high).toBeGreaterThan(0);
  });

  test('10.08 — m²=1 el rango está correctamente calculado', async ({ page }) => {
    await page.goto(URL);
    const res = await page.evaluate(() => window.__calcular('nordelta', 'casa', 1, false, 'muybueno', false));
    expect(res.low).toBe(Math.round(2600 * 0.85));
    expect(res.high).toBe(Math.round(2600 * 1.15));
  });

  test('10.09 — m² decimal (ej: 85.5) funciona correctamente', async ({ page }) => {
    await page.goto(URL);
    const res = await page.evaluate(() => window.__calcular('nordelta', 'casa', 85.5, false, 'muybueno', false));
    expect(res).not.toBeNull();
    expect(res.valor).toBe(Math.round(85.5 * 2600));
  });

  test('10.10 — El más caro posible: Nordelta casa agua nuevo pileta', async ({ page }) => {
    await page.goto(URL);
    const res = await page.evaluate(() => window.__calcular('nordelta', 'casa', 500, true, 'nuevo', true));
    // 500 * 4000 * 1.15 * 1.08 = 2484000
    expect(res.valor).toBe(Math.round(500 * 4000 * 1.15 * 1.08));
  });

  test('10.11 — El más barato posible: Delta casa regular sin extras', async ({ page }) => {
    await page.goto(URL);
    const res = await page.evaluate(() => window.__calcular('delta', 'casa', 50, false, 'regular', false));
    // 50 * 1600 * 0.80 = 64000
    expect(res.valor).toBe(64000);
  });

  test('10.12 — Low siempre < High en 50 combinaciones aleatorias', async ({ page }) => {
    await page.goto(URL);
    const zonas  = ['nordelta', 'villanueva', 'bancalari', 'delta'];
    const tipos  = ['casa', 'dpto', 'lote'];
    const estados = ['nuevo', 'muybueno', 'bueno', 'regular'];
    const results = await page.evaluate(({ z, t, e }) => {
      const combos = [];
      for (const zona of z) for (const tipo of t) for (const estado of e) {
        const res = window.__calcular(zona, tipo, 100, true, estado, true);
        combos.push({ zona, tipo, estado, low: res.low, high: res.high });
      }
      return combos;
    }, { z: zonas, t: tipos, e: estados });
    for (const r of results) {
      expect(r.low, `${r.zona}/${r.tipo}/${r.estado}`).toBeLessThan(r.high);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 11: Mobile responsive (8 tests)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Mobile responsive (375px)', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('11.01 — Página carga en mobile', async ({ page }) => {
    await page.goto(URL);
    await expect(page.locator('[data-testid="step-1"]')).toBeVisible();
  });

  test('11.02 — Formulario visible en 375px', async ({ page }) => {
    await page.goto(URL);
    await expect(page.locator('[data-testid="zona"]')).toBeVisible();
    await expect(page.locator('[data-testid="tipo"]')).toBeVisible();
    await expect(page.locator('[data-testid="m2"]')).toBeVisible();
  });

  test('11.03 — Botón siguiente accesible en mobile', async ({ page }) => {
    await page.goto(URL);
    await expect(page.locator('[data-testid="btn-siguiente-1"]')).toBeVisible();
  });

  test('11.04 — Wizard completo funciona en mobile', async ({ page }) => {
    const { low, high } = await runWizard(page, { zona: 'nordelta', tipo: 'casa', agua: 'si', m2: '100', estado: 'muybueno', pileta: 'no' });
    expect(low).toBe(340000);
    expect(high).toBe(460000);
  });

  test('11.05 — Resultado visible en mobile', async ({ page }) => {
    await runWizard(page);
    await expect(page.locator('[data-testid="result-low"]')).toBeVisible();
    await expect(page.locator('[data-testid="result-high"]')).toBeVisible();
  });

  test('11.06 — WhatsApp CTA visible en mobile', async ({ page }) => {
    await runWizard(page);
    await expect(page.locator('[data-testid="btn-whatsapp"]')).toBeVisible();
  });

  test('11.07 — Toggles de agua/pileta clickeables en mobile', async ({ page }) => {
    await page.goto(URL);
    // Labels son los elementos visibles de los toggles — hacer click en ellos
    await page.click('label[for="agua-si"]');
    await page.click('label[for="pileta-si"]');
    await expect(page.locator('[data-testid="agua-si"]')).toBeChecked();
    await expect(page.locator('[data-testid="pileta-si"]')).toBeChecked();
  });

  test('11.08 — Toggle "no" está por defecto (agua y pileta)', async ({ page }) => {
    await page.goto(URL);
    await expect(page.locator('[data-testid="agua-no"]')).toBeChecked();
    await expect(page.locator('[data-testid="pileta-no"]')).toBeChecked();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 12: Tabla de precios base expuesta (6 tests)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Tabla de precios base (__PRECIOS)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test('12.01 — Nordelta casa al agua = USD 4000/m²', async ({ page }) => {
    const p = await page.evaluate(() => window.__PRECIOS.nordelta.casa.agua);
    expect(p).toBe(4000);
  });

  test('12.02 — Nordelta casa interna = USD 2600/m²', async ({ page }) => {
    const p = await page.evaluate(() => window.__PRECIOS.nordelta.casa.noAgua);
    expect(p).toBe(2600);
  });

  test('12.03 — Nordelta lote al agua = USD 3400/m²', async ({ page }) => {
    const p = await page.evaluate(() => window.__PRECIOS.nordelta.lote.agua);
    expect(p).toBe(3400);
  });

  test('12.04 — Villanueva base = USD 2150/m²', async ({ page }) => {
    const p = await page.evaluate(() => window.__PRECIOS.villanueva.casa.agua);
    expect(p).toBe(2150);
  });

  test('12.05 — Bancalari base = USD 1900/m²', async ({ page }) => {
    const p = await page.evaluate(() => window.__PRECIOS.bancalari.casa.noAgua);
    expect(p).toBe(1900);
  });

  test('12.06 — Delta base = USD 1600/m²', async ({ page }) => {
    const p = await page.evaluate(() => window.__PRECIOS.delta.casa.noAgua);
    expect(p).toBe(1600);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 13: Accesibilidad básica (6 tests)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Accesibilidad básica', () => {
  test('13.01 — Todos los selects tienen label aria-label o label element', async ({ page }) => {
    await page.goto(URL);
    const zona   = page.locator('[data-testid="zona"]');
    const tipo   = page.locator('[data-testid="tipo"]');
    const estado = page.locator('[data-testid="estado"]');
    await expect(zona).toHaveAttribute('aria-label');
    await expect(tipo).toHaveAttribute('aria-label');
    await expect(estado).toHaveAttribute('aria-label');
  });

  test('13.02 — Input m² tiene aria-label', async ({ page }) => {
    await page.goto(URL);
    await expect(page.locator('[data-testid="m2"]')).toHaveAttribute('aria-label');
  });

  test('13.03 — Input nombre tiene aria-label', async ({ page }) => {
    await page.goto(URL);
    await fillStep1(page);
    await page.click('[data-testid="btn-siguiente-1"]');
    await expect(page.locator('[data-testid="nombre"]')).toHaveAttribute('aria-label');
  });

  test('13.04 — Input teléfono tiene aria-label', async ({ page }) => {
    await page.goto(URL);
    await fillStep1(page);
    await page.click('[data-testid="btn-siguiente-1"]');
    await expect(page.locator('[data-testid="telefono"]')).toHaveAttribute('aria-label');
  });

  test('13.05 — Página tiene meta description', async ({ page }) => {
    await page.goto(URL);
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc).toBeTruthy();
    expect(desc.length).toBeGreaterThan(20);
  });

  test('13.06 — Página tiene lang="es"', async ({ page }) => {
    await page.goto(URL);
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBe('es');
  });
});
