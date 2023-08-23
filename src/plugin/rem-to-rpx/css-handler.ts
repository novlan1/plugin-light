export function handleRem(content, factor = 100, unit = 'rpx') {
  if (content == null) {
    return content;
  }
  const pattern = new RegExp('([0-9.]*[0-9]+)([\\s]*)(rem)', 'g');
  let match: any = undefined;

  const records: Array<any> = [];

  // eslint-disable-next-line no-cond-assign
  while (match = pattern.exec(content)) {
    const keyword = match[0];
    const number = parseFloat(match[1]);
    records.push({
      index: match.index,
      length: keyword.length,
      keyword,
      number,
    });
  }

  if (records.length > 0) {
    let buffer = `${content}`;
    for (const record of records) {
      let number = (record.number * factor).toFixed(2);
      if (number == `${parseInt(number, 10)}`) {
        // 去掉无效的小数点，比如：28.00
        number = `${parseInt(number, 10)}`;
      }
      buffer = buffer.replace(record.keyword, `${number}${unit}`);
    }
    return buffer;
  }

  return content;
}


