// tailwind config is required for editor support
const config = require("@jjordy/tailwind-config/index.js");
module.exports = {
  ...config,
  plugins: [require("@tailwindcss/typography")],
};
