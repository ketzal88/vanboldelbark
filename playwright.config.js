const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

const COTIZADOR_URL = `file://${path.join(__dirname, 'pretasacion', 'index.html').replace(/\\/g, '/')}`;

module.exports = defineConfig({
  testDir: './tests',
  timeout: 15000,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: COTIZADOR_URL,
    headless: true,
    viewport: { width: 1280, height: 800 },
    // Exponer la URL para los tests
    extraHTTPHeaders: {},
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});

// Exportar la URL para que los tests la usen
module.exports.COTIZADOR_URL = COTIZADOR_URL;
