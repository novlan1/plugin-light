export type IReplaceTemplateTagOptions = {
  // 替换标签映射表
  replaceTmpTagMap?: {
    [k: string]: {
      mp: string;
      web: string;
    }
  }
};
