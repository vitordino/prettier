"use strict";

const runPrettier = require("../runPrettier");

expect.addSnapshotSerializer(require("../path-serializer"));

// TODO: move `multiple-patterns` tests into this one

describe("should support dot pattern", () => {
  runPrettier("cli/multiple-patterns", [".", "-l"]).test({
    status: 1
  });
});

describe("should expand directories", () => {
  runPrettier("cli/multiple-patterns", [
    "directory",
    "other-directory",
    "-l"
  ]).test({
    status: 1
  });
});