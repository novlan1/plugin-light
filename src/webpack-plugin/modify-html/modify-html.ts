/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-this-alias */
import * as fs from 'fs';
import { getGitAuthor } from 't-comm';

/**
 * Execute html action
 *
 * @param {Object} command - Command data for given action
 * @return {Function|null} - Function that returns a promise or null
 * @ignore
 */
function htmlAction(command: {
  source: string;
  destination: string;
  ssr?: boolean;
  urls: Array<string>;
  prefetchList?: Array<string>;
}, options: {
  verbose?: boolean
}) {
  const { verbose } = options;
  if (!command.source || !command.destination) {
    if (verbose) {
      console.log('  - HtmlModifyPlugin: Warning - parameter has to be formatted as follows: { source: <string>, destination: <string> }');
    }
    return null;
  }

  return function () {
    return new Promise(((resolve, reject) => {
      fs.lstat(command.destination, (dErr, dStats) => {
        if (dErr || !dStats.isFile()) {
          return reject(dErr);
        }
        let htmlString = '';
        let htmlLine: Array<string> = [];
        if (command.ssr || dErr) {
          // ssr取源文件为模板。模板文件不存在也取源文件为模板。
          htmlString = fs.readFileSync(command.source, 'utf-8');
        } else {
          htmlString = fs.readFileSync(command.destination, 'utf-8');
        }
        htmlLine = htmlString.split('\n');
        // 修改html：匹配<body>字符串，替换为 <body>...
        let injectHtml = '<style>[v-cloak] {display: none;}</style>' + '\n';
        if (!command.ssr) {
          if (htmlString.indexOf('<div id=\'app\'') == -1 && htmlString.indexOf('<div id="app"') == -1) {
            injectHtml += '<div id=\'app\'></div>' + '\n';
          }
          injectHtml += `
<script>
    window.__serverFailed = 0;
    window.__breakerTime = 0;
</script>`;
          // 静态版本这两个也用于熔断保护，由熔断机制动态替换其值
        } else {
          injectHtml += '<!--vue-ssr-outlet-->' + '\n';
          injectHtml += `
<script>
    window.__serverCount = {{__serverCount||0}};
    window.__serverFailed = {{__serverFailed||0}};
    window.__breakerTime = {{__breakerTime||0}};
</script>`;
        }
        for (const i in command.urls) {
          injectHtml += `<script src='${command.urls[i]}'></script>` + '\n';
        }
        injectHtml += `<script>window.igameVersion = { version: ${new Date().getTime()}, author: '${getGitAuthor()}' };</script>`;
        let injectPrefetch = '';
        let prefetchInjected = false;
        if (Array.isArray(command.prefetchList)) {
          command.prefetchList.map((item) => {
            injectPrefetch += `<link rel="dns-prefetch" href="${item}">` + '\n';
            injectPrefetch += `<link rel="preconnect" href="${item}" crossorigin>` + '\n';
          });
        }

        for (const i in htmlLine) {
          if (htmlLine[i].indexOf('<link') > -1 && injectPrefetch && !prefetchInjected) {
            prefetchInjected = true;
            // eslint-disable-next-line no-loop-func
            htmlLine[i] = htmlLine[i].replace(/<link.*>/, a => `${a}\n${injectPrefetch}`);
          }
          if (htmlLine[i].indexOf('<body>') > -1) {
            htmlLine[i] = htmlLine[i].replace('<body>', `<body>\n${injectHtml}`);
          }
          if (command.ssr && htmlLine[i].indexOf('<title>') > -1) {
            // 多页面标题可变
            htmlLine[i] = htmlLine[i].replace(/<title>.*?<\/title>/, '<title>{{title}}</title>');
          }
        }

        fs.writeFileSync(command.destination, htmlLine.join('\n'), 'utf-8');
        resolve(1);
      });
    }));
  };
}

const classCallCheck = function (instance: any, Constructor: any) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
};


const createClass = (function () {
  function defineProperties(target: string, props: Record<string, any>) {
    for (let i = 0; i < props.length; i++) {
      const descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor: any, protoProps: any, staticProps?: any) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}());


const toConsumableArray = function (arr: any) {
  if (Array.isArray(arr)) {
    const arr2 = Array(arr.length);

    for (let i = 0; i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }
  return Array.from(arr);
};


export const HtmlModifyPlugin = (function () {
  function HtmlModifyPlugin(options: any) {
    // @ts-ignore
    classCallCheck(this, HtmlModifyPlugin);

    // @ts-ignore
    this.options = this.setOptions(options);
  }

  createClass(HtmlModifyPlugin, [
    {
      key: 'setOptions',
      value: function setOptions(userOptions: any) {
        const defaultOptions: Record<string, any> = {
          verbose: false,
          moveWithMkdirp: false,
          onStart: {},
          onEnd: {},
        };

        for (const key in defaultOptions) {
          if (userOptions.hasOwnProperty(key)) {
            defaultOptions[key] = userOptions[key];
          }
        }

        return defaultOptions;
      },
    },
    {
      key: 'checkOptions',
      // 只有两个调用：this.checkOptions('onStart')和this.checkOptions('onEnd')
      value: function checkOptions(stage: string, compiler: any) {
        const that = this;

        if (this.options.verbose && Object.keys(this.options[stage]).length) {
          console.log(`HtmlModifyPlugin: processing ${stage} event`);
        }

        const operationList: Array<any> = [];

        if (this.options[stage] && Array.isArray(this.options[stage])) {
        // onEnd: [{copy:[]}, {delete:[]}]，数组形式，按序执行
          this.options[stage]
          // @ts-ignore
            .map(opts => operationList.push.apply(operationList, toConsumableArray(that.parseOptions(opts, true))));
        } else {
        // onEnd: {copy:[], delete:[]}，对象形式，不保证顺序
        // @ts-ignore
          operationList.push.apply(operationList, toConsumableArray(this.parseOptions(this.options[stage])));
        }

        if (operationList.length) {
          operationList
            .reduce((previous, fn: Function) => previous
              .then((retVal: any) => fn(retVal, compiler))
              .catch((err: Error) => console.log(err)), Promise.resolve());
        }
      },
    },
    {
      key: 'replaceHash',
      value: function replaceHash(filename: string) {
        return filename.replace('[hash]', this.fileHash);
      },
    },
    {
      key: 'processAction',
      value: function processAction(action: Function, params: any, commandOrder: Array<any>) { // 预处理动作函数
        const result = action(params, this.options);

        if (result !== null) {
          commandOrder.push(result);
        }
      },
    },
    {
      key: 'parseOptions',
      // options : {copy:[...], delete:[...]}
      value: function parseOptions(options: any) {
        const that = this;

        const commandOrder: Array<string> = [];

        Object.keys(options).forEach((actionType) => {
          const actionOptions = options[actionType];
          let actionParams: Record<string, any> | null = null;

          actionOptions.forEach((actionItem: any) => {
            switch (actionType) {
              case 'html':
                actionParams = {
                  source: that.replaceHash(actionItem.source),
                  destination: actionItem.destination,
                  urls: actionItem.urls,
                  prefetchList: actionItem.prefetchList || [],
                  ssr: actionItem.ssr || '', // '','client','server'
                };

                that.processAction(htmlAction, actionParams, commandOrder);

                break;

              default:
                break;
            }
          });
        });

        return commandOrder;
      },
    },
    {
      key: 'apply',
      value: function apply(compiler: any) {
        const that = this;

        const comp = function comp(compilation: any) {
          try {
            that.checkOptions('onStart', compiler);
          } catch (error) {
            compilation.errors.push(error);
          }
        };

        const afterEmit = function afterEmit(compilation: any, cb: Function) {
        // 已经计算好的hash
          that.fileHash = compilation.hash;

          try {
            that.checkOptions('onEnd', compiler);
          } catch (error) {
            compilation.errors.push(error);
          }

          cb();
        };

        if (compiler.hooks) {
          compiler.hooks.compilation.tap('compilation', comp);
          compiler.hooks.afterEmit.tapAsync('afterEmit', afterEmit);
        } else {
          compiler.plugin('compilation', comp);
          compiler.plugin('after-emit', afterEmit);
        }
      },
    }]);
  return HtmlModifyPlugin;
}());


