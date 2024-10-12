
export const getPlatform = () => process.env.UNI_PLATFORM || '';
export const getUtsPlatform = () => process.env.UNI_UTS_PLATFORM || '';
export const getAppPlatform = () => process.env.UNI_APP_PLATFORM || '';

export const isH5 = () => getPlatform() === 'h5';
export const isApp = () => getPlatform() === 'app';
export const isAppAndroid = () => getAppPlatform() === 'android' || getUtsPlatform() === 'app-android';
export const isAppIOS = () => getAppPlatform() === 'ios' || getUtsPlatform() === 'app-ios';

export const isMp = () => /^mp-/i.test(getPlatform());
export const isMpWeixin = () => getPlatform() === 'mp-weixin';
export const isMpAlipay = () => getPlatform() === 'mp-alipay';
export const isMpBaidu = () => getPlatform() === 'mp-baidu';

export const isMpKuaishou = () => getPlatform() === 'mp-kuaishou';
export const isMpQQ = () => getPlatform() === 'mp-qq';
export const isMpToutiao = () => getPlatform() === 'mp-toutiao';

export const isQuickapp = () => /^quickapp-webview/i.test(getPlatform());
export const isQuickappUnion = () => getPlatform() === 'quickapp-webview-union';
export const isQuickappHuawei = () => getPlatform() === 'quickapp-webview-huawei';
