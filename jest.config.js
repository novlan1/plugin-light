/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname, './'),
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',

  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  snapshotSerializers: ['jest-serializer-vue'],
  testMatch: [
    '<rootDir>/tests/unit/**/*.spec.(js|jsx|ts|tsx)|<rootDir>/__tests__/*.(js|jsx|ts|tsx)',
  ],
  collectCoverageFrom: [
    'src/module/ingame-pvp-wsq/views/red-envelope/*.{js,vue}',
    '!src/utils/auth.js',
    '!src/utils/request.js',
    '!src/components/**/*.{js,vue}',
  ],
  coverageDirectory: '<rootDir>/tests/unit/coverage',
  collectCoverage: true,
  coverageReporters: [
    'lcov',
    'text-summary',
  ],
  testResultsProcessor: '<rootDir>/node_modules/@tencent/jest-report-processor',
  testURL: 'http://localhost/',
};
