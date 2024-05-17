/** @type {import('jest').Config} */

const { pathsToModuleNameMapper } = require('ts-jest');

const { compilerOptions } = require('./tsconfig.json');

module.exports = {
    ...require('@pulsifi/fn/configs/dev/jest'),
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: '<rootDir>/',
    }),
    coverageThreshold: {
        global: {
            functions: 45,
        },
    },
};
