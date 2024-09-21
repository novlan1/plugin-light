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


export class GlobalThisPolyfillPlugin {
  options: any;

  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler: any) {
    compiler.hooks.emit.tap('globalThisPolyfillPlugin', (compilation: any) => {
      try {
        const { assets } = compilation;
        const key = 'app.js';
        if (!assets[key]) return;

        let source = assets[key].source().toString();
        source = `${insertCode}
        ${source}
        `;

        assets[key].source = function () {
          return source;
        };
        assets[key].size = function () {
          return source.length;
        };
      } catch (err) {
        console.warn('GlobalThisPolyfillPlugin.err: ', err);
      }
    });
  }
}

