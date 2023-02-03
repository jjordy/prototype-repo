const sharedConfig = require("@jjordy/tailwind-config/index.js");

module.exports = {
  // prefix ui lib classes to avoid conflicting with the app
  prefix: "ui-",
  ...sharedConfig,
};
