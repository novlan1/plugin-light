var transferVue = require('./transfer-vue-plugin')
const transferJs = require('./transfer-js-plugin')

module.exports = function pluginsInstall (config,options) {
  config.plugin('transferVue').use(transferVue,options)
  config.plugin('transferJs').use(transferJs,options)
}
