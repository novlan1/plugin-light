export interface IGenMpPluginPlaygroundOptions {
  // 插件名称
  pluginName?: string;

  // 演练场目录，默认是
  // path.resolve(process.env.UNI_INPUT_DIR, 'mp-plugin-public');
  playgroundDir?: string;

  // 输出目录，默认为 process.env.UNI_OUTPUT_DIR
  outputDir?: string;
}
