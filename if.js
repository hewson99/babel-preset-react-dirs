const t = require('@babel/types');

let IF = 'if'
let ELSE_IF = 'else-if'
let ELSE = 'else'

function processAlias(alias) {
  if (!alias) return;
  IF = alias[IF] || IF
  ELSE_IF = alias[ELSE_IF] || ELSE_IF
  ELSE = alias[ELSE] || ELSE
}

function getNextJSXElement(path) {
  while (path = path.getNextSibling()) {
    if (!path.node)
      return;
    if (t.isJSXElement(path.node))
      return path;
  }
}

function nextCondition(path) {
  return processAttr(path, [ELSE_IF, ELSE], (err, condition, key) => {
    if (err) return t.nullLiteral();
    const node = path.node;
    path.remove();
    return key === ELSE_IF ? t.conditionalExpression(
      condition,
      node,
      nextCondition(getNextJSXElement(path))
    ) : node
  })
}


function processAttr(path, conditions, cb) {
  if (!path) return cb(true)
  const { openingElement: { attributes } } = path.node;
  let condition = null;
  let p = attributes.length;
  while (p-- > 0) {
    let attr = attributes[p];
    for (let i = 0; i < conditions.length; i++)
      if (conditions[i] == attr.name.name) {
        condition = attr.value && attr.value.expression;
        attributes.splice(p, 1);
        return cb(null, condition, conditions[i]);
      }
  }
  return cb(true);
}

module.exports = ((_, options) => {
  processAlias(options.alias);
  return {
    visitor: {
      JSXElement(path) {
        processAttr(path, [IF], (err, condition) => {
          if (err) return;
          path.replaceWith(
            t.jSXExpressionContainer(
              t.conditionalExpression(
                condition,
                path.node,
                nextCondition(getNextJSXElement(path))
              )
            )
          )
        })
      }
    }
  };
});
