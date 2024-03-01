export type IReplaceList = Array<{
  from: string;
  to: string;
  files: Array<string | RegExp>;
}>;

export type IReplaceContentOptions = {
  replaceList?: IReplaceList
};


