export type IDir = {
  from: string;
  to: string;
  type?: 'mv' | 'cp';
};

export type ICopyDirOptions= {
  dirs?: Array<IDir>
};
