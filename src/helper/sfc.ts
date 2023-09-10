import { parseComponent } from 'vue-template-compiler';

export function parseSFC(source: string) {
  const parsed = parseComponent(source);
  return parsed;
}

export function composeSFC(parsed: Record<string, any>) {
  const { template = {}, script = {}, styles = [] } = parsed;
  let res = '';
  res += `<template>${template.content || ''}</template>\n`;
  res += `<script>${script.content || ''}</script>\n`;

  res = styles.reduce((acc: string, style: Record<string, any>) => {
    const { attrs } = style;
    const attrStr = Object.keys(attrs).reduce((attrStr, attr) => {
      const value = attrs[attr];
      if (typeof value === 'boolean') {
        if (value) {
          attrStr += ` ${attr}`;
        }
        return attrStr;
      }

      attrStr += ` ${attr}='${value}'`;
      return attrStr;
    }, '');

    acc += `<style${attrStr}></style>\n`;
    return acc;
  }, res);
  return res;
}

