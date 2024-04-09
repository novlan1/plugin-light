export class FixMiniCssPlugin {
  apply(compiler: any) {
    compiler.hooks.thisCompilation.tap('remo', (compilation: any) => {
      const {
        mainTemplate,
      } = compilation;
      mainTemplate.hooks.localVars.intercept({
        register: (tapInfo: any) => {
          if (tapInfo.name === 'mini-css-extract-plugin') {
            tapInfo.fn = function () {};
          }
          return tapInfo;
        },
      });
      mainTemplate.hooks.requireEnsure.intercept({
        register: (tapInfo: any) => {
          if (tapInfo.name === 'mini-css-extract-plugin') {
            tapInfo.fn = function () {};
          }
          return tapInfo;
        },
      });
    });
  }
}
