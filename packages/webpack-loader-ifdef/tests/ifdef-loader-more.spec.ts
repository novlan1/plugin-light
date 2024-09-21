import path from 'path';
import preprocessLoader from '../src/loader';

jest.mock('loader-utils', () => ({
  getOptions: jest.fn()
    .mockReturnValueOnce({
      type: ['js'],
      num: 1,
      context: { H5: true, VUE3: true },
    })
    .mockReturnValueOnce({
      context: { H5: true },
      num: 2,
    })
    .mockReturnValueOnce({
      type: ['js'],
      context: { 'MP-WEIXIN': true },
      num: 3,
    })
    .mockReturnValueOnce({
      type: ['html'],
      context: { H5: true, VUE2: false, VUE3: true },
      num: 4,
    })
    .mockReturnValueOnce({
      type: ['html'],
      context: { 'MP-WEIXIN': true, VUE2: false, VUE3: true, H5: false },
      num: 5,
    })
    .mockReturnValueOnce({
      type: ['js'],
      context: { 'MP-WEIXIN': true, VUE2: false, VUE3: true, H5: false },
      num: 6,
    })
    .mockReturnValueOnce({
      type: ['css'],
      context: { H5: true },
      num: 7,
    })
    .mockReturnValueOnce({
      type: ['css'],
      context: { 'MP-WEIXIN': true },
      num: 8,
    })
    .mockReturnValueOnce({
      type: ['html'],
      context: { H5: true },
      num: 9,
    })
    .mockReturnValueOnce({
      type: ['html', 'css', 'js'],
      context: { H5: true },
      num: 10,
    })
    .mockReturnValueOnce({
      type: ['html', 'css', 'js'],
      context: { 'MP-WEIXIN': true },
      num: 11,
    })
    .mockReturnValue({
      type: ['js'],
      context: { 'MP-WEIXIN': true },
    }),
}));


const jsStr = `
// #ifdef H5 || VUE2
console.log('1');
// #endif

// #ifndef H5
console.log('2');
// #endif

console.log('3');
`;


const htmlStr = `
<template>
  <!-- #ifdef VUE3 -->
  <!-- #ifdef MP -->
  <button
    :id="id"
    :data-detail="dataset"
    :class="buttonClass"
    :hover-class="['press-button--active', hoverClass]"
    :lang="lang"
    :form-type="formType"
    :style="buttonStyle"
    :open-type="disabled || loading || (canIUseGetUserProfile && openType === 'getUserInfo') ? '' : openType"
    :business-id="businessId"
    :session-from="sessionFrom"
    :send-message-title="sendMessageTitle"
    :send-message-path="sendMessagePath"
    :send-message-img="sendMessageImg"
    :show-message-card="showMessageCard"
    :app-parameter="appParameter"
    :aria-label="ariaLabel"
    @click.stop="onFakeClick"
    @tap.stop="onFakeTap"
    @getuserinfo="onGetUserInfo"
    @contact="onContact"
    @getphonenumber="onGetPhoneNumber"
    @error="onError"
    @launchapp="onLaunchApp"
    @opensetting="onOpenSetting"
    @chooseavatar="onChooseAvatar"
  >
    <!-- #endif -->
    <!-- #endif -->

    <!-- #ifdef VUE2 || H5 || APP || APP-PLUS -->
    <Button
      :id="id"
      :data-detail="dataset"
      :class="buttonClass"
      :hover-class="['press-button--active', hoverClass]"
      :lang="lang"
      :form-type="formType"
      :style="buttonStyle"
      :open-type="disabled || loading || (canIUseGetUserProfile && openType === 'getUserInfo') ? '' : openType"
      :business-id="businessId"
      :session-from="sessionFrom"
      :send-message-title="sendMessageTitle"
      :send-message-path="sendMessagePath"
      :send-message-img="sendMessageImg"
      :show-message-card="showMessageCard"
      :app-parameter="appParameter"
      :aria-label="ariaLabel"
      @click.stop="onFakeClick"
      @tap.stop="onFakeTap"
      @getuserinfo="onGetUserInfo"
      @contact="onContact"
      @getphonenumber="onGetPhoneNumber"
      @error="onError"
      @launchapp="onLaunchApp"
      @opensetting="onOpenSetting"
      @chooseavatar="onChooseAvatar"
    >
      <!-- #endif -->
      <template v-if="isESportLoading">
        <PressLoading
          loading-scenes="btn"
        />
      </template>
      <template v-else-if="loading">
        <press-loading-plus
          :custom-class="loadingClass"
          :size="loadingSize"
          :type="loadingType"
          :color="loadingColor"
        />
        <div
          v-if="loadingText"
          class="press-button__loading-text"
        >
          {{ loadingText }}
        </div>
      </template>
      <template v-else>
        <press-icon-plus
          v-if="icon"
          size="1.2em"
          :name="icon"
          :class-prefix="classPrefix"
          class="press-button__icon"
          custom-style="line-height: inherit;"
        />
        <div class="press-button__text">
          <slot />
        </div>
      </template>
    <!-- #ifdef VUE2 || H5 || APP || APP-PLUS -->
    </Button>
    <!-- #endif -->
    <!-- #ifdef VUE3 -->
    <!-- #ifdef MP -->
  </button>
  <!-- #endif -->
  <!-- #endif -->
</template>
`;


const cssStr = `
/* #ifdef H5 || VUE2 */
console.log('a.1');
/* #endif */

/* #ifndef H5 */
console.log('b.1');
/* #endif */

console.log('c.1');
`;

const vueStr = `
${jsStr}

${htmlStr}

${cssStr}
`;


describe('preprocessLoader.js', () => {
  it('preprocessLoader.1.jsStr', () => {
    expect(preprocessLoader.call({
      resourcePath: path.resolve(process.cwd(), './src', 'MOCK_PAGE.vue'),
    }, jsStr)).toMatchSnapshot();
  });

  it('preprocessLoader.2.jsStr', () => {
    expect(preprocessLoader.call({
      resourcePath: path.resolve(process.cwd(), './src', 'MOCK_PAGE.vue'),
    }, jsStr)).toMatchSnapshot();
  });

  it('preprocessLoader.3.jsStr', () => {
    expect(preprocessLoader.call({
      resourcePath: path.resolve(process.cwd(), './src', 'MOCK_PAGE.vue'),
    }, jsStr)).toMatchSnapshot();
  });

  it('preprocessLoader.4.htmlStr', () => {
    expect(preprocessLoader.call({
      resourcePath: path.resolve(process.cwd(), './src', 'MOCK_PAGE.vue'),
    }, htmlStr)).toMatchSnapshot();
  });

  it('preprocessLoader.5.htmlStr', () => {
    expect(preprocessLoader.call({
      resourcePath: path.resolve(process.cwd(), './src', 'MOCK_PAGE.vue'),
    }, htmlStr)).toMatchSnapshot();
  });

  it('preprocessLoader.6.htmlStr', () => {
    expect(preprocessLoader.call({
      resourcePath: path.resolve(process.cwd(), './src', 'MOCK_PAGE.vue'),
    }, htmlStr)).toMatchSnapshot();
  });
  it('preprocessLoader.7.cssStr', () => {
    expect(preprocessLoader.call({
      resourcePath: path.resolve(process.cwd(), './src', 'MOCK_PAGE.vue'),
    }, cssStr)).toMatchSnapshot();
  });
  it('preprocessLoader.8.cssStr', () => {
    expect(preprocessLoader.call({
      resourcePath: path.resolve(process.cwd(), './src', 'MOCK_PAGE.vue'),
    }, cssStr)).toMatchSnapshot();
  });
  it('preprocessLoader.9.cssStr', () => {
    expect(preprocessLoader.call({
      resourcePath: path.resolve(process.cwd(), './src', 'MOCK_PAGE.vue'),
    }, cssStr)).toMatchSnapshot();
  });
  it('preprocessLoader.10.vueStr', () => {
    expect(preprocessLoader.call({
      resourcePath: path.resolve(process.cwd(), './src', 'MOCK_PAGE.vue'),
    }, vueStr)).toMatchSnapshot();
  });
  it('preprocessLoader.11.vueStr', () => {
    expect(preprocessLoader.call({
      resourcePath: path.resolve(process.cwd(), './src', 'MOCK_PAGE.vue'),
    }, vueStr)).toMatchSnapshot();
  });
});

