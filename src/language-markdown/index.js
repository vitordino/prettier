"use strict";

const printer = require("./printer-markdown");
const options = require("./options");
const createLanguage = require("../utils/create-language");

const languages = [
  createLanguage(
    require("linguist-languages/data/Markdown"),
    ({ filenames, extensions }) => ({
      since: "1.8.0",
      parsers: ["remark"],
      vscodeLanguageIds: ["markdown"],
      filenames: filenames.concat(["README"]),
      extensions: extensions.filter(extension => extension !== ".mdx")
    })
  ),
  createLanguage(require("linguist-languages/data/Markdown"), () => ({
    name: "MDX",
    since: "1.15.0",
    parsers: ["mdx"],
    vscodeLanguageIds: ["mdx"],
    filenames: [],
    extensions: [".mdx"]
  }))
];

const printers = {
  mdast: printer
};

module.exports = {
  languages,
  options,
  printers
};
