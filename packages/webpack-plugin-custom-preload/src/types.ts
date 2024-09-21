type IHash = string | RegExp | Array<string>;


export interface ICustomPreloadOptions {
  list?: Array<{
    condition: {
      hash?: IHash;
      path?: IHash;
    };
    pages?: string | Array<string | Array<string>>;
  }>
}


export interface IParsedCustomPreloadOption {
  condition?: {
    hash?: IHash;
    path?: IHash;
  };
  pages?: Array<{
    page: Array<string>;
    delay?: number;
  }>;
}

export interface IUniRoutes {
  path: string;
  name: string;
}
