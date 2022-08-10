const analyzeComponent = require('./handler/analyze-component');

String.prototype.replaceAll = function (s1, s2) {
  return this.replace(new RegExp(s1, 'gm'), s2);
};

class myTestPlugin {
  apply(compiler) {
    // 编译后处理
    compiler.hooks.done.tap('CommAdapterPlugin', () => {
      try {
        analyzeComponent();
      } catch (err) {
        console.log('err', err);
      }
    });
  }
}

module.exports = myTestPlugin;
