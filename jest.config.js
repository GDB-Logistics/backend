module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    maxWorkers: 1, // This ensures that tests run serially
};
