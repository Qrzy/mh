module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '^vue$': 'vue/dist/vue.common.js',
  },
  collectCoverage: true,
  collectCoverageFrom: ['**/*.{ts,tsx}'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
    '.*\\.vue$': 'vue-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(js-bbcode-parser)/)'],
};
