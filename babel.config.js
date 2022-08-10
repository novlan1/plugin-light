module.exports = {
  presets: [
    '@vue/app',
  ],
  plugins: [
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true,
    }, 'vant'],
  ],
  env: {
    test: {
      presets: [['@babel/preset-env', {
        targets: {
          node: 'current',
        },
      }]],
      plugins: [
        ['import', {
          libraryName: 'vant',
          style: false,
        }, 'vant'],
      ],
    },
  },
};
