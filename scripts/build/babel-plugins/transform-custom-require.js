"use strict";

// `eval("require")` -> `require`

module.exports = function(babel) {
  const t = babel.types;
  const isEvalRequire = node =>
    t.isCallExpression(node) &&
    t.isIdentifier(node.callee, { name: "eval" }) &&
    node.arguments.length === 1 &&
    t.isLiteral(node.arguments[0], { value: "require" });

  return {
    visitor: {
      CallExpression(path) {
        if (isEvalRequire(path.node)) {
          path.replaceWith(t.identifier("require"));
        }
      }
    }
  };
};
