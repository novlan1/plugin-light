export type ITransferLocalFileOptions= {
  // 是否修改打包产物中的引用位置，默认 false
  isModifyRef?: boolean;
  // 处理的文件夹列表
  adapterDirs?: Array<string>;
};
