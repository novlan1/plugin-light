
const DOT = '.';

export const PUBLISH_BASE_OPTIONS = {
  host: `9${DOT}134${DOT}54${DOT}128`,	// 腾讯云服务器
  // host: `127${dot}0${dot}0${dot}1`, // 本地调试
  port: '3005',
  method: 'POST',
  path: '/web-publish/publish',
};
