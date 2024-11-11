// jest.ci.config.js

export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    // Other Jest configurations
    // For example, disable coverage if not needed
    collectCoverage: false,
    // Optionally, run tests in serial to reduce resource usage
    maxWorkers: 1,
};
