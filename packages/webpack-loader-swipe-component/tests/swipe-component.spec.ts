import swipeComponent from '../src/loader';


const source = `
<template>
  <div class="match-list-page gp-commonbg">
    <LeftTopBar @clickCancel="goBack(false)" />
    <div class="content">
      <van-swipe
        :loop="loop"
      >
        <van-swipe-item
          v-for="(reward, index) in rewardList"
          :key="index"
        >
          <div class="award-group">
            <div
              v-for="(item, index) in reward"
              :key="index"
              class="award-item"
            >
              <div class="award-box">
                <img
                  v-lazy="item.pic"
                  class="award-img"
                >
                <div class="award-name">
                  <span>{{ item.text }}</span>
                </div>
              </div>
              <div class="award-rank">
                {{ item.title }}
              </div>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<script>
import LeftTopBar from 'src/local-component/ui/gp-match-horz/left-top-bar/left-top-bar.vue';
import Vue from 'vue';
import { Swipe, SwipeItem } from 'vant';
import 'vant/lib/swipe/index.css';
import 'vant/lib/swipe-item/index.css';

Vue.use(Swipe);
Vue.use(SwipeItem);

export default {
  name: 'MatshList',
  components: {
    LeftTopBar,
  },
  props: {
    prizeList: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      loop: false, // 轮播是否循环
    };
  },
  computed: {
    rewardList() {
      const rewards = [];
      if (this.prizeList?.length) {
        for (let i = 0; i < this.prizeList.length; i++) {
          const index = Math.floor(i / 3);
          if (Math.floor(i % 3) === 0) {
            rewards.push([]);
          }
          rewards[index].push(this.prizeList[i]);
        }
      }
      console.log('rewardList:', rewards);
      console.log('rewardList type:', typeof(rewards));
      return rewards;
    },
  },
  created() {
  },
  mounted() {
  },
  methods: {
    // 右上角关闭按钮
    clickCancel() {
      this.$emit('clickCancel');
    },
    // 点击赛事规则
    clickRule() {
      this.$emit('clickRule');
    },
    siteChildItemLoad() {
      this.$emit('siteChildItemLoad');
    },
  },
};
</script>

<style lang="scss" src="src/page/gp-match-horz/user/sass/match/matsh-list.scss" scoped></style>
`;

describe('swipeComponent', () => {
  it('should work correctly', () => {
    expect(swipeComponent(source)).toMatchSnapshot();
  });
});
