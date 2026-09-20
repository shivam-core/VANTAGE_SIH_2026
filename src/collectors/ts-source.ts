import * as ts from 'typescript';

export interface Observation {
  detectorId: string;
  type: string;
  symbol: string;
  startLine: number;
  endLine: number;
  args: string[];
}

export function parseSource(code: string, fileName: string): Observation[] {
  const sourceFile = ts.createSourceFile(fileName, code, ts.ScriptTarget.Latest, true);
  const observations: Observation[] = [];

  function visit(node: ts.Node) {
    if (ts.isCallExpression(node)) {
      const expr = node.expression;
      let symbol = '';
      if (ts.isIdentifier(expr)) {
        symbol = expr.text;
      } else if (ts.isPropertyAccessExpression(expr)) {
        symbol = expr.name.text;
      }
      
      if (['createHash', 'createHmac', 'createCipheriv', 'generateKeyPair', 'generateKeyPairSync', 'createSign', 'createVerify', 'publicEncrypt', 'privateDecrypt', 'createECDH'].includes(symbol)) {
        const args = node.arguments.map(arg => {
          if (ts.isStringLiteral(arg)) return arg.text;
          return 'unknown';
        });

        const start = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        const end = sourceFile.getLineAndCharacterOfPosition(node.getEnd());
        
        observations.push({
          detectorId: `TS-CRYPTO-${symbol.toUpperCase()}`,
          type: symbol,
          symbol,
          startLine: start.line + 1,
          endLine: end.line + 1,
          args
        });
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return observations;
}
