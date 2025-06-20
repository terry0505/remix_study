const { vercelPreset } = require('@remix-run/dev');

module.exports = {
  ...vercelPreset(),
  future: {
    v2_routeConvention: true,
  },
};