// jest.config.js
// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
    verbose: true,
    silent: true,
    testEnvironment: 'node',
    preset: 'ts-jest/presets/default-esm',
    resolver: 'ts-jest-resolver',
    moduleDirectories: ['node_modules', 'src'],
    modulePaths: ['node_modules', 'src'],
    roots: ['src'],
    testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
    // transform: {
    //     '^.+\\.(ts|tsx)$': 'ts-jest',
    // },
};

module.exports = config;
