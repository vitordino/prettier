"use strict";

module.exports = function(linguistData, transform) {
  linguistData = Object.assign(linguistData, transform(linguistData));

  const language = {};

  for (const key in linguistData) {
    const newKey = key === "languageId" ? "linguistLanguageId" : key;
    language[newKey] = linguistData[key];
  }

  return language;
};
