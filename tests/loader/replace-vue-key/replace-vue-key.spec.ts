import replaceVueKey from '../../../loader/replace-vue-key';


beforeAll(() => {
  process.env.VUE_APP_PLATFORM = 'mp-weixin';
});


describe('replaceVueKey', () => {
  it('replaceVueKey', () => {
    const source = `
<template>
  <div>
    <div 
      v-for="(item, index) of list" 
      :key="'type' + index"
    >
    {{ item }}
    </div>
  </div>
</template>
    `;
    expect(replaceVueKey(source)).toMatchSnapshot();
  });

  it('replaceVueKey.2', () => {
    const source = `
<template>
  <div>
    <div 
      v-for="(item, index) of list" 
      :key="index + 'type'"
    >
    {{ item }}
    </div>
  </div>
</template>
    `;
    expect(replaceVueKey(source)).toMatchSnapshot();
  });


  it('replaceVueKey.3', () => {
    const source = `
<template>
  <div>
    <div 
      v-for="(item, blueIndex) of list" 
      :key=" blueIndex + 'type' "
    >
    {{ item }}
    </div>
  </div>
</template>
    `;
    expect(replaceVueKey(source)).toMatchSnapshot();
  });
});
