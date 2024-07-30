import { parseLongConstant } from '../../../src/webpack-plugin/check-long-constant/core';

const MOCK_DATA = `
var YYYYYY = [{
  name: "见习主理人",
  level: 0,
  matchNum: 1,
  peopleNum: 0,
}],
z = {
a: '1',
}
`;

describe('parseLongConstant', () => {
  it('parseLongConstant', () => {
    const result = parseLongConstant(MOCK_DATA);

    expect(result).toMatchSnapshot();
  });
});
