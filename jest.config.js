module.exports = {
    preset: 'ts-jest',
    roots: ["test"],
    testEnvironment: 'node',
    moduleNameMapper: {
        '^(admin|site|charts|utils|db|settings)/(.*)$': '<rootDir>/$1/$2',
        '^settings$': '<rootDir>/settings',
        '^serverSettings$': '<rootDir>/serverSettings'
    },
    "transform": {
        "^.+\\.(j|t)sx?$": "<rootDir>/node_modules/ts-jest/preprocessor.js",
    },
    "transformIgnorePatterns": [
        "<rootDir>/node_modules/(?!lodash-es/.*)"
    ],
};
