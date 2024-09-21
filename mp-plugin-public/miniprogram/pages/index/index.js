// eslint-disable-next-line no-undef
requirePlugin('hello-plugin');
// eslint-disable-next-line no-undef
Page({
  data: {
    items: [],
    currentItem: 0,
  },
  onLoad() {
    // plugin.sayHello()
    // const world = plugin.answer
  },
  addItem() {
    this.data.items.push(this.data.currentItem);
    this.data.currentItem += 1;
    this.setData({
      items: this.data.items,
      currentItem: this.data.currentItem,
    });
  },
});
