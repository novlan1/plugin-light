// process.env.TZ = 'GMT+0800';

module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.[t|j]sx?$': [
      'babel-jest',
      {
        presets: ['@babel/preset-env', '@babel/preset-typescript'],
      },
    ],
  },
  moduleNameMapper: {
    '^@plugin-light/(.*)$': '<rootDir>/packages/plugin-light-$1',
    '^@plugin-light/webpack-loader-(.*)$': '<rootDir>/packages/webpack-loader-$1',
  },
  testMatch: [
    '**/tests/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)',
  ],
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageReporters: ['lcov', 'text-summary'],
};
