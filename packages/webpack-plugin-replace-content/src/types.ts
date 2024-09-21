export type IReplaceList = Array<{
  // 要替换的内容
  from: string | RegExp;
  // 要替换成的目标内容
  to: string;
  // 要处理的文件列表
  files?: Array<string | RegExp>;
}>;

export type IReplaceContentOptions = {
  replaceReg: RegExp;
  fileNameReg: RegExp;
  // IReplaceContentOptions[keyof Pick<IReplaceContentOptions, 'replaceList'>
  replaceList: IReplaceList;
};
