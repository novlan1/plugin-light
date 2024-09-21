export type IIfdefOptions = {
  // 上下文，比如 { H5: true }
  context?: Record<string, boolean>;

  // 是否打印日志, 默认 false
  log?: boolean;

  // 处理的文件类型，可选值为 'css', 'js', 'html'
  type: Array<string>;
};
