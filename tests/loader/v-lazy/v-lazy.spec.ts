import lazyLoader from '../../../loader/v-lazy';

jest.mock('loader-utils', () => ({
  getOptions: jest.fn()
    // 工具函数 loader-options.shouldUseLoader
    // 调用了一次 getOptions，所以需要mock空对象两次
    .mockReturnValueOnce({
    })
    .mockReturnValueOnce({
    })
    .mockReturnValue({
      urlHandler: 'getCompressImgUrl',
    }),
}));

beforeAll(() => {
  process.env.UNI_PLATFORM = 'mp-weixin';
});


describe('lazyLoader', () => {
  it('without urlHandler', () => {
    const source = `
<template>
 <div>
   <img v-lazy="img">
 </div>  
</template>
    `;
    expect(lazyLoader(source)).toMatchSnapshot();
  });

  it('with urlHandler', () => {
    const source = `
<template>
 <div>
   <img v-lazy="img">
 </div>  
</template>
    `;
    expect(lazyLoader(source)).toMatchSnapshot();
  });

  it('with urlHandler and size', () => {
    const source = `
<template>
 <div>
   <img v-lazy="img" size="50">
   <img v-lazy="img" data-size="50">
   <img v-lazy="src" width="50" height="100">
   <img v-lazy="src" data-width="50" data-height="100">
   <img v-lazy="src" data-width="50" data-height="100" style="padding: 20px;" class="match-img">
 </div>  
</template>
    `;
    expect(lazyLoader(source)).toMatchSnapshot();
  });
});
