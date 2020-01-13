"use strict";
const fs = require("fs");
const path = require("path");
const dir = path.resolve(__dirname, "../shims");
const shims = fs.readdirSync(dir);

module.exports = function() {
  return {
    resolveId(importee) {
      const file = importee + ".js";
      return shims.includes(file) ? path.join(dir, file) : importee;
    }
  };
};
