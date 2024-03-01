/* eslint-disable @typescript-eslint/no-require-imports */
const parser = require('@babel/parser');
const traverse = require('@babel/traverse');
const generator = require('@babel/generator');
const htmlparser2 = require('htmlparser2');
const render = require('dom-serializer').default;


export function swipeComponent(source: string) {
  if (process.env.VUE_APP_PLATFORM === 'h5') {
    return source;
  }

  const templateResult = handleTemplate(source);
  const scriptResult = handleScript(source);
  const styleResult = handleStyle(source);
  const outputResult = `${templateResult}\n${scriptResult}\n${styleResult}\n`;

  return outputResult;
}

function handleTemplate(fileContent: string) {
  const firstIndex = fileContent.indexOf('<template');
  const lastIndex = fileContent.lastIndexOf('</template>');
  const content = fileContent.slice(firstIndex + '<template'.length + 1, lastIndex);

  const dom = htmlparser2.parseDocument(content,  { lowerCaseTags: false, lowerCaseAttributeNames: false });

  function getElementsByTagName(dom: any, name: string) {
    const result: Array<any> = [];
    // console.log('dom.children',dom.children)
    for (const child of dom.children) {
      if (child.name == name) {
        result.push(child);
      }
      if (child.children) {
        result.push(...getElementsByTagName(child, name));
      }
    }
    return result;
  }

  function replaceAttr(attrs: Record<string, string>, searchName: string, replaceName: string, expand = true) {
    if (Object.keys(attrs)
      .includes(searchName)) {
      attrs[replaceName] = attrs[searchName];
    }

    if (expand && Object.keys(attrs)
      .includes(`:${searchName}`)) {
      replaceAttr(attrs, `:${searchName}`, `:${replaceName}`, false);
    }
  }

  const elements = getElementsByTagName(dom, 'Swipe');
  elements.push(...getElementsByTagName(dom, 'van-swipe'));
  if (elements === null || elements.length === 0) {
    return `<template>\n${content}\n</template>\n`;
  }

  const vantSwipeItemCompNames = ['SwipeItem', 'van-swipe-item'];
  for (const element of elements) {
    element.name = 'swiper';

    if (element.attribs[':indicator-dots'] == null) {
      element.attribs['indicator-dots'] = element.attribs['indicator-dots'] || 'true'; // 加个默认为true
    }
    if (element.attribs[':indicator-active-color'] == null) {
      element.attribs['indicator-active-color'] = element.attribs['indicator-color'] || '#1989fa';
    }
    if (element.attribs[':indicator-color'] == null) {
      element.attribs['indicator-color'] = element.attribs['indicator-inactive-color'] || 'rgba(0, 0, 0, .3)';
    }

    for (const child of element.children) {
      if (vantSwipeItemCompNames.includes(child.name)) {
        child.name = 'swiper-item';
      }
    }

    const autoplayKeys = ['autoplay', ':autoplay'];
    for (const autoplayKey of autoplayKeys) {
      if (Object.keys(element.attribs)
        .includes(autoplayKey)) {
        element.attribs[autoplayKey] = String(parseInt(element.attribs[autoplayKey]) > 0);
      }
    }

    replaceAttr(element.attribs, 'loop', 'circular');
    replaceAttr(element.attribs, 'show-indicators', 'indicator-dots');
    // replaceAttr(element.attribs, 'indicator-color', 'indicator-active-color');
  }

  const output = render(dom, { decodeEntities: false });
  return `<template>\n${output}\n</template>\n`;
}

function handleScript(fileContent: string) {
  const regex = /<script(.)*?>/;
  const match = fileContent.match(regex);
  if (!match) {
    return '<script></script>';
  }

  const firstIndex = match.index! + match[0].length;
  const lastIndex = fileContent.lastIndexOf('</script>');
  const content = fileContent.slice(firstIndex, lastIndex);

  const ast = parser.parse(content, { sourceType: 'module' });
  const visitor = {
    ImportSpecifier(path: any) {
      // import { Swipe, SwipeItem, Tab, Toast, Tabs } from 'vant';
      if (path.node.imported.name === 'Swipe'
      || path.node.imported.name === 'SwipeItem') {
        path.remove();
      }
    },
    ImportDefaultSpecifier(path: any) {
      // import Swipe from 'vant/lib/swipe';
      // import SwipeItem from 'vant/lib/swipe-item';
      if (path.node.local.name === 'Swipe'
      || path.node.local.name === 'SwipeItem'
      ) {
        path.remove();
      }
    },
    ImportDeclaration(path: any) {
      if (path.node.specifiers.length === 0
        && (path.node.source.value === 'vant/lib/swipe/index.css'
        || path.node.source.value === 'vant/lib/swipe-item/index.css')
      ) {
        // import 'vant/lib/swipe/index.css';
        // import 'vant/lib/swipe-item/index.css';
        path.remove();
      }
    },
    ExpressionStatement(path: any) {
      // Vue.use(Swipe);
      // Vue.use(SwipeItem);
      // Vue.use(Swipe).use(SwipeItem);
      if (path.node.expression.arguments?.length > 0
                && (path.node.expression.arguments[0]?.name === 'Swipe'
                 || path.node.expression.arguments[0]?.name === 'SwipeItem')) {
        path.remove();
      }
    },
    Property(path: any) {
      /*
            components: {
                LgameMatch, Merchant, Swipe, SwipeItem, OfflineWatchSchedule, PrivilegeBrief, Ticket,
                TaskDialog, ScrollView, VanLoading, Error,
            },
            */
      if (path.node.key.name === 'Swipe' || path.node.key.name === 'SwipeItem') {
        path.remove();
      }
    },
  };
  traverse.default(ast, visitor);
  const output = generator.default(ast, {});
  return `${match[0]}\n${output.code}\n</script>\n`;
}

function handleStyle(fileContent: string) {
  const index = fileContent.indexOf('<style');
  const output = fileContent.slice(index);
  return output;
}

