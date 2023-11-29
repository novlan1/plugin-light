export type IReplaceLibraryOptions = {
  replaceLibraryList?: Array<{
    from: string;
    to: string;
    exact?: boolean
  }>;
  replaceContentList?: Array<{
    path: string;
    content: Function | string;
  }>
};
