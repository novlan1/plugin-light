import { transFormRem } from 't-comm/lib/rem/rem';

export function handleRem(content, factor = 100, unit = 'rpx') {
  return transFormRem(content, factor, unit);
}


