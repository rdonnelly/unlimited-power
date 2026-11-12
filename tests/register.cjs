const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const { config } = ts.readConfigFile(
  path.join(root, 'tsconfig.json'),
  ts.sys.readFile,
);
const aliases = Object.entries(config.compilerOptions.paths);
const resolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...args) {
  for (const [alias, [target]] of aliases) {
    const prefix = alias.replace('*', '');
    if (request.startsWith(prefix)) {
      request = path.resolve(
        root,
        target.replace('*', request.slice(prefix.length)),
      );
      break;
    }
  }
  return resolve.call(this, request, ...args);
};

require.extensions['.ts'] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    fileName: filename,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  });
  module._compile(outputText, filename);
};
