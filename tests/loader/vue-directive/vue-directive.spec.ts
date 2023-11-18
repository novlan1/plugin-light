import { replaceDirective } from '../../../src/loader/vue-directive/vue-directive';


describe('replaceDirective', () => {
  it('replaceDirective', () => {
    const res = replaceDirective(`<li
  v-treport="propsData.treport"
  class="tip-comp-storelist-item"
  @click="onClickItem"
  >`, ['treport']);

    expect(res).toBe(`<li
  
  class="tip-comp-storelist-item"
  @click="onClickItem"
  >`);
  });

  it('one line', () => {
    const res = replaceDirective('<li v-treport="propsData.treport" class="tip-comp-storelist-item">', ['treport']);

    expect(res).toBe('<li  class="tip-comp-storelist-item">');
  });
});
