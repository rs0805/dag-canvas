const VAR_RE = /\{\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}\}/g;

const RESERVED = new Set([
  'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger',
  'default', 'delete', 'do', 'else', 'export', 'extends', 'false',
  'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof',
  'new', 'null', 'return', 'super', 'switch', 'this', 'throw', 'true',
  'try', 'typeof', 'var', 'void', 'while', 'with', 'yield',
  'let', 'static', 'implements', 'interface', 'package', 'private',
  'protected', 'public', 'enum', 'await',
]);

export const parseVariables = (text = '') => {
  const seen = new Set();
  for (const m of text.matchAll(VAR_RE)) {
    const name = m[1];
    if (!RESERVED.has(name)) seen.add(name);
  }
  return [...seen];
};
