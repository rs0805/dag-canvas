const VAR_RE = /\{\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}\}/g;

// Reserved words that cannot be used as JS variable names. Used to reject
// patterns like {{ class }} or {{ function }} which match the identifier
// regex but would be syntax errors as actual JS variables.
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
