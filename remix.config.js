const { createViteConfig } = require('@remix-run/dev/config/vite');
const { vercelVitePreset } = require('@remix-run/dev');

module.exports = createViteConfig({
  ...vercelVitePreset(),
  future: {
    v2_routeConvention: true
  }
});