export function checkBundleAnalyze() {
  return process.argv.includes('--bundleAnalyzer')
  || !!process.env.npm_config_report;
}

export function checkDebugMode() {
  return !!process.env.DEBUG_MODE;
}
