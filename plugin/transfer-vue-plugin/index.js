const analyzeComponent = require('./analyze-component');

String.prototype.replaceAll = function (s1, s2) {
  return this.replace(new RegExp(s1, 'gm'), s2);
};

class myTestPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.done.tap('CommAdapterPlugin', () => {
      try {
        console.log('\x1B[32m%s\x1B[0m', '正在使用 uni-plugin-light');
        analyzeComponent(this.options);
      } catch (err) {
        console.log('err', err);
      }
    });
  }
}

module.exports = myTestPlugin;
