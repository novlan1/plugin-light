const insertCode = `
try {
  (function() {
    if (typeof globalThis === 'object') return;
    Object.defineProperty(Object.prototype, '__magic__', {
        get: function() {
            return this;
        },
        configurable: true
    });
    __magic__.globalThis = __magic__;
    delete Object.prototype.__magic__;
  }());

  (function() {
    if (typeof console.table === 'function') return;
    console.table = console.log;
  }())
} catch(err) {}
`;


export function globalThisPolyfillVitePlugin() {
  return {
    name: 'globalThisPolyFill',

    renderChunk(code: string, chunk: Record<string, any>) {
      const id = chunk.fileName;

      if (id === 'app.js') {
        const newCode = `${insertCode}
  ${code}
  `;
        return newCode;
      }

      return code;
    },
  };
}
