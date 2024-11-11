// jest.config.js
export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        // Handle CSS imports (optional)
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',

        // Handle module aliases (if any)
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    transform: {
        '^.+\\.(ts|tsx)?$': ['ts-jest', {
            tsconfig: 'tsconfig.test.json', // Point to your test tsconfig
            diagnostics: { ignoreCodes: ['TS151001'] }
        }],
        "^.+\\.(js|jsx)$": "babel-jest",
    },
    testMatch: ['**/*.spec.ts', '**/*.spec.tsx'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
