const t = require('@babel/types');

let FOR = 'for';

function processAlias(alias) {
  if (!alias) return;
  FOR = alias[FOR] || FOR
}

function genParams(forVal) {
  if (t.isNumericLiteral(forVal))
    return [];
  let paramsAst = forVal.left
  if (t.isSequenceExpression(paramsAst))
    paramsAst = paramsAst.expressions.map(e => e);
  if (t.isIdentifier(paramsAst))
    paramsAst = [paramsAst];
  return paramsAst;
}


function processFor(path, forVal) {
  let paramsAst = genParams(forVal);
  let arrayAst = forVal.right
  arrayAst = t.callExpression(
    t.memberExpression(t.identifier('Object'), t.identifier('keys')),
    [arrayAst]
  )

  const newNode = t.jSXExpressionContainer(
    t.callExpression(
      t.memberExpression(arrayAst, t.identifier('map')),
      [
        t.arrowFunctionExpression(paramsAst,
          t.callExpression(
            t.functionExpression(null, paramsAst, t.blockStatement([t.returnStatement(path.node)])),
            ((paramsAst = [...paramsAst]).unshift(
              t.memberExpression(forVal.right, paramsAst[0], true)), paramsAst.slice(0, 3))
          )
        )
      ]
    )
  );

  path.replaceWith(newNode);
}

module.exports = ((_, options) => {
  processAlias(options.alias);
  return {
    visitor: {
      JSXElement(path) {
        const { openingElement: { attributes } } = path.node;
        let forVal = null;
        let p = attributes.length;
        while (p-- > 0) {
          let attr = attributes[p];
          if (attr.name.name === FOR) {
            forVal = attr.value.expression;
            attributes.splice(p, 1);
            processFor(path, forVal)
            return;
          }
        }
      }
    }
  };
});
