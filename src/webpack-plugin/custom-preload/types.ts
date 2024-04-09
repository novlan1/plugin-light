type IHash = string | RegExp | Array<string>;


export interface ICustomPreloadOptions {
  list?: Array<{
    condition: {
      hash?: IHash;
      href?: IHash;
    };
    pages: string | Array<string | Array<string>>;
  }>
}


export interface IParsedCustomPreloadOption {
  condition?: {
    hash?: IHash;
    href?: IHash;
  };
  pages?: Array<{
    page: Array<string>;
    delay?: number;
  }>;
}
