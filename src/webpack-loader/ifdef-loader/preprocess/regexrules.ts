
const delim: Record<string, any> = {
  simple: {
    echo: '^#echo[ \t]+(.*?)[ \t]*$',
    exec: '^#exec[ \t]+(\\S+)[ \t]*\\((.*)\\)[ \t]*$',
    include: '^(.*)#include(?!-)[ \t]+(.*?)[ \t]*$', // allow prefix characters to specify the indent level of included file
    'include-static': '^(.*)#include-static[ \t]+(.*?)[ \t]*$',
  },
  html: {
    echo: '<!--[ \t]*#echo[ \t]+(.*?)[ \t]*(?:-->|!>)',
    exec: '<!--[ \t]*#exec[ \t]+(\\S+)[ \t]*\\((.*)\\)[ \t]*(?:-->|!>)',
    include: '(.*)<!--[ \t]*#include(?!-)[ \t]+(.*?)[ \t]*(?:-->|!>)',
    'include-static': '(.*)<!--[ \t]*#include-static[ \t]+(.*?)[ \t]*(?:-->|!>)',
    exclude: {
      start: '[ \t]*<!--[ \t]*#exclude(?:[ \t]+(.*?))?[ \t]*(?:-->|!>)(?:[ \t]*\n+)?',
      end: '[ \t]*<!--[ \t]*#endexclude[ \t]*(?:-->|!>)(?:[ \t]*\n)?',
    },
    extend: {
      start: '[ \t]*<!--[ \t]*#extend(?!able)[ \t]+(.*?)[ \t]*(?:-->|!>)(?:[ \t]*\n+)?',
      end: '[ \t]*<!--[ \t]*#endextend[ \t]*(?:-->|!>)(?:[ \t]*\n)?',
    },
    extendable: '<!--[ \t]*#extendable[ \t]*(?:-->|!>)',
    if: {
      start: '[ \t]*<!--[ \t]*#(ifndef|ifdef|if)[ \t]+(.*?)[ \t]*(?:-->|!>)(?:[ \t]*\n+)?',
      end: '[ \t]*<!(?:--)?[ \t]*#endif[ \t]*(?:-->|!>)(?:[ \t]*\n)?',
    },
    foreach: {
      start: '[ \t]*<!--[ \t]*#foreach[ \t]+(.*?)[ \t]*(?:-->|!>)(?:[ \t]*\n+)?',
      end: '[ \t]*<!(?:--)?[ \t]*#endfor[ \t]*(?:-->|!>)(?:[ \t]*\n)?',
    },
  },
  js: {
    echo: [
      '/\\*[ \t]*#echo[ \t]+(.*?)[ \t]*\\*(?:\\*|/)',
      '//[ \t]*#echo[ \t]+(.*?)[ \t]*$',
    ],
    exec: '(?://|/\\*)[ \t]*#exec[ \t]+(\\S+)[ \t]*\\((.*)\\)[ \t]*(?:\\*(?:\\*|/))?',
    include: [
      '^(.*)/\\*[ \t]*#include(?!-)[ \t]+(.*?)[ \t]*\\*(?:\\*|/)',
      '^(.*)//[ \t]*#include(?!-)[ \t]+(.*?)[ \t]*$',
    ],
    'include-static': [
      '^(.*)/\\*[ \t]*#include-static[ \t]+(.*?)[ \t]*\\*(?:\\*|/)',
      '^(.*)//[ \t]*#include-static[ \t]+(.*?)[ \t]*$',
    ],
    exclude: {
      start: '[ \t]*(?://|/\\*)[ \t]*#exclude(?:[ \t]+([^\n*]*))?[ \t]*(?:\\*(?:\\*|/))?(?:[ \t]*\n+)?',
      end: '[ \t]*(?://|/\\*)[ \t]*#endexclude[ \t]*(?:\\*(?:\\*|/))?(?:[ \t]*\n)?',
    },
    extend: {
      start: '[ \t]*(?://|/\\*)[ \t]*#extend(?!able)[ \t]+([^\n*]*)(?:\\*(?:\\*|/))?(?:[ \t]*\n+)?',
      end: '[ \t]*(?://|/\\*)[ \t]*#endextend[ \t]*(?:\\*(?:\\*|/))?(?:[ \t]*\n)?',
    },
    extendable: '[ \t]*(?://|/\\*)[ \t]*#extendable[ \t]*(?:\\*/)?',
    if: {
      start: '[ \t]*(?://|/\\*)[ \t]*#(ifndef|ifdef|if)[ \t]+([^\n*]*)(?:\\*(?:\\*|/))?(?:[ \t]*\n+)?',
      end: '[ \t]*(?://|/\\*)[ \t]*#endif[ \t]*(?:\\*(?:\\*|/))?(?:[ \t]*\n)?',
    },
    foreach: {
      start: '[ \t]*(?://|/\\*)[ \t]*#foreach[ \t]+([^\n*]*)(?:\\*(?:\\*|/))?(?:[ \t]*\n+)?',
      end: '[ \t]*(?://|/\\*)[ \t]*#endfor[ \t]*(?:\\*(?:\\*|/))?(?:[ \t]*\n)?',
    },
  },
  coffee: {
    echo: '#+[ \t]*@echo[ \t]+(.*?)[ \t]*$',
    exec: '#+[ \t]*@exec[ \t]+(\\S+)[ \t]*\\((.*)\\)[ \t]*$',
    include: '^(.*?)#+[ \t]*@include(?!-)[ \t]+(.*?)[ \t]*$',
    'include-static': '^(.*?)#+[ \t]*@include-static[ \t]+(.*?)[ \t]*$',
    exclude: {
      start: '^[ \t]*#+[ \t]*@exclude(?:[ \t]+(.*?))?[ \t]*\n+',
      end: '^[ \t]*#+[ \t]*@endexclude[ \t]*\n?',
    },
    extend: {
      start: '^[ \t]*#+[ \t]*@extend(?!able)[ \t]+(.*?)\n+',
      end: '^[ \t]*#+[ \t]*@endextend[ \t]*\n?',
    },
    extendable: '^[ \t]*#+[ \t]*@extendable[ \t]*$',
    if: {
      start: '^[ \t]*#+[ \t]*@(ifndef|ifdef|if)[ \t]+(.*?)[ \t]*\n+',
      end: '^[ \t]*#+[ \t]*@endif[ \t]*\n?',
    },
    foreach: {
      start: '^[ \t]*#+[ \t]*@foreach[ \t]+(.*?)[ \t]*\n+',
      end: '^[ \t]*#+[ \t]*@endfor[ \t]*\n?',
    },
  },
};


delim.xml = delim.html;

delim.javascript = delim.js;
delim.jsx = delim.js;
delim.c = delim.js;
delim.cc = delim.js;
delim.cpp = delim.js;
delim.cs = delim.js;
delim.csharp = delim.js;
delim.java = delim.js;
delim.less = delim.js;
delim.sass = delim.js;
delim.scss = delim.js;
delim.css = delim.js;
delim.php = delim.js;
delim.ts = delim.js;
delim.tsx = delim.js;
delim.peg = delim.js;
delim.pegjs = delim.js;
delim.jade = delim.js;
delim.styl = delim.js;
delim.go = delim.js;

delim.bash = delim.coffee;
delim.shell = delim.coffee;
delim.sh = delim.coffee;

export default delim;
export {
  delim,
};
