import lazyLoader from '../../../loader/v-lazy';

jest.mock('loader-utils', () => ({
  getOptions: jest.fn()
    .mockReturnValueOnce({
    })
    .mockReturnValue({
      urlHandler: 'getCompressImgUrl',
    }),
}));

beforeAll(() => {
  process.env.VUE_APP_PLATFORM = 'mp-weixin';
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
