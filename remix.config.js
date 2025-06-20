const { vercelPreset } = require('@remix-run/dev');

module.exports = {
  ...vercelPreset(),
  future: {
    v3_routeConvention: true,
  },
};