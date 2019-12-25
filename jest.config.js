module.exports = {
  roots: ['<rootDir>/test'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['test/**/?(*.)+(spec|test).[jt]s?(x)'],
};
