module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main'
  ],
  preset: '@shelf/jest-mongodb',
  roots: ['<rootDir>/src'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }

}
