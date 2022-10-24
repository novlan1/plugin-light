// const { parseComponent } = require('vue-template-compiler');


// const mockStr = `
// <template>
//   <!-- 分页滚动条 -->
//   <div
//     v-show="scrollBarNum>2 && (showThis || isHoldDown)"
//     ref="scrollBar"
//     class="tip-match-scrollbar"
//     :class="{'tip-match-scrollbar--active': isHoldDown}"
//     @click.stop="onClickScrollBar"
//   >
//     <div
//       ref="scrollBarThumb"
//       class="tip-match-scrollbar-thumb"
//       @touchmove="onTouchMoveScrollBar"
//       @touchstart="onTouchStartScrollBar"
//       @touchend="onTouchEndScrollBar"
//     >
//       <div class="tip-match-team-member-tip">
//         {{ parseInt(currentPageNum) }}/{{ Math.ceil(scrollBarNum) - 1 }}页
//       </div>
//     </div>
//   </div>
// </template>

// <script>

// let startY = 0;
// let disY = 0;
// let showThisTimer = null;
// let holdDownTimer = null;

// export default {
//   props: {
//     watchData: {
//       type: [Array, Object],
//       default: () => [],
//     },
//     scrollMainRef: {
//       type: [Object, null],
//       default: null,
//     },
//     maxScrollTop: {
//       type: Number,
//       default: 0,
//     },
//   },
//   options: {
//     virtualHost: true,
//   },
//   data() {
//     return {
//       scrollTranslateY: 0,
//       isHoldDown: false,
//       currentPageNum: 1,
//       scrollBarNum: 0,
//       showThis: false,
//     };
//   },
//   computed: {
//     pageScrollRef() {
//       if (this.scrollMainRef) return this.scrollMainRef;
//       return this.$parent.$refs.scheduleTree;
//     },
//     thumbHeight() {
//       const res = this.scrollBarTotalHeight / this.scrollBarNum;
//       if (res < 30) return 30;
//       return 50;
//     },
//     scrollBarTotalHeight() {
//       return 240;
//     },
//   },
//   watch: {
//     watchData: {
//       handler() {
//         this.getScrollMainRef();
//         this.$nextTick(() => {
//           this.getScrollBarNum();
//         });
//       },
//       deep: true,
//       immediate: true,
//     },
//     pageScrollRef: {
//       handler(val, oldVal) {
//         val?.addEventListener('scroll', this.onScrollMain);
//         oldVal?.removeEventListener('scroll', this.onScrollMain);
//       },
//     },
//     scrollTranslateY() {
//     },
//   },
//   created() {},
//   mounted() {
//     this.pageScrollRef?.addEventListener('scroll', this.onScrollMain);
//   },
//   beforeDestroy() {
//     this.pageScrollRef?.removeEventListener('scroll', this.onScrollMain);
//   },
//   methods: {
//     refresh() {
//       this.getScrollBarNum();
//     },
//     // 页面顶部最大距离
//     getPageMaxTop() {
//       const { pageScrollRef } = this;
//       if (!pageScrollRef) return;

//       return pageScrollRef?.scrollHeight - pageScrollRef?.clientHeight;
//     },
//     // scrollBar顶部最大距离
//     getScrollBarMaxTop() {
//       const { scrollBar, scrollBarThumb } = this.$refs;
//       return scrollBar?.clientHeight - scrollBarThumb?.clientHeight;
//     },
//     // 修正滑块顶部高度
//     reviseThumbTop(T) {
//       const maxTop = this.getScrollBarMaxTop();
//       if (T < 0) {
//         T = 0;
//       } else if (T > maxTop) {
//         T = maxTop;
//       }
//       return T;
//     },
//     // 页面顶部最大距离/scrollBar顶部最大距离
//     getPageBarScale() {
//       const scale = this.getPageMaxTop() / this.getScrollBarMaxTop();
//       return scale;
//     },
//     // 获取当前页数
//     getCurrentPageNum(scrollTop) {
//       const { pageScrollRef } = this;
//       this.currentPageNum = scrollTop === 0 ? 1 : Math.ceil(scrollTop / pageScrollRef?.clientHeight) ;
//     },
//     // 让页面滚动
//     makePageScroll(scrollTop) {
//       const { pageScrollRef } = this;
//       if (!pageScrollRef) return;
//       pageScrollRef.scrollTo(pageScrollRef.scrollLeft, scrollTop);
//     },
//     // 显示自己
//     onShowThis() {
//       this.showThis = true;
//       clearTimeout(showThisTimer);
//       showThisTimer = setTimeout(() => {
//         this.showThis = false;
//       }, 2000);
//     },
//     getScrollMainRef() {
//       const res = this.$parent.$refs;
//       return res;
//     },
//     getScrollBarNum() {
//       const { pageScrollRef } = this;
//       if (!pageScrollRef) return;
//       window.getScrollBarNum = this.getScrollBarNum; // TODO: to delete
//       this.scrollBarNum = pageScrollRef?.scrollHeight / pageScrollRef?.clientHeight;
//       console.log('scrollBarNum', this.scrollBarNum, pageScrollRef?.scrollHeight, pageScrollRef?.clientHeight);
//       this.$forceUpdate();

//       if (this.getNum > 10) {
//         clearTimeout(this.timer);
//         return;
//       }
//       if (!this.getNum) this.getNum = 1;
//       this.getNum += 1;

//       this.timer = setTimeout(() => {
//         this.getScrollMainRef();
//         this.$nextTick(() => {
//           this.getScrollBarNum();
//         });
//       }, 100);
//       if (!pageScrollRef) return 0;
//     },
//     onScrollMain(e) {
//       if (this.isHoldDown || this.clickScrollBar) return;

//       this.onShowThis();

//       const { scrollTop } = e.target;
//       const scale = this.getPageBarScale();

//       this.scrollTranslateY = scrollTop / scale;
//       this.getCurrentPageNum(scrollTop);
//     },
//     onTouchEndScrollBar() {
//       clearTimeout(holdDownTimer);
//       this.isHoldDown = false;
//     },
//     onTouchMoveScrollBar(e) {
//       if (!this.isHoldDown) return;

//       this.onShowThis();

//       e.preventDefault();
//       const endY = e.touches[0].clientY;

//       let T = endY - disY;
//       T = this.reviseThumbTop(T);

//       this.scrollTranslateY = T;
//       this.$forceUpdate();

//       const scale = this.getPageBarScale();
//       let scrollTop = T * scale;

//       if (T === this.getScrollBarMaxTop()) {
//         scrollTop = this.getPageMaxTop();
//       }
//       this.makePageScroll(scrollTop);

//       this.getCurrentPageNum(scrollTop);
//     },
//     // 触发滚动条
//     onTouchStartScrollBar(e) {
//       startY = e.touches[0].clientY;
//       disY = startY - this.scrollTranslateY;

//       clearTimeout(holdDownTimer);
//       holdDownTimer = setTimeout(() => {
//         this.isHoldDown = true;
//       }, 200);
//     },
//     onClickScrollBar(e) {
//       this.$emit('onClickScrollBar');
//       this.clickScrollBar = true;
//       this.onShowThis();

//       const { offsetY } = e;

//       this.scrollTranslateY = offsetY;

//       let scrollTop = offsetY * this.getPageBarScale();
//       const maxTop = this.getPageMaxTop();
//       if (scrollTop > maxTop) {
//         scrollTop = maxTop;
//       }

//       this.makePageScroll(scrollTop);

//       setTimeout(() => {
//         this.clickScrollBar = false;
//       });
//     },
//   },
// };

// </script>
// <style lang="scss" scoped src="./css/index.scss"></style>
// `;


// const parsed = parseComponent(mockStr);
// // console.log('parsed', parsed, parsed.styles[0].attrs);

// function composeSFC(parsed) {
//   const { template = {}, script = {}, styles = [] } = parsed;
//   let res = '';
//   res += `<template>${template.content || ''}</template>\n`;
//   res += `<script>${script.content || ''}</script>\n`;

//   res = styles.reduce((acc, style) => {
//     const { attrs } = style;
//     const attrStr = Object.keys(attrs).reduce((attrStr, attr) => {
//       const value = attrs[attr];
//       if (typeof value === 'boolean') {
//         if (value) {
//           attrStr += ` ${attr}`;
//         }
//         return attrStr;
//       }

//       attrStr += ` ${attr}='${value}'`;
//       return attrStr;
//     }, '');

//     acc += `<style${attrStr}></style>\n`;
//     return acc;
//   }, res);
//   return res;
// }

// console.log('composeSFC', composeSFC(parsed));
// const htmlparser2 = require('htmlparser2');

// const dom = htmlparser2.parseDocument(parsed.template.content);

// console.log('dom', dom);
