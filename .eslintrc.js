'use strict';

module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
    ],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module',
        ecmaFeatures: {
            modules: true
        },
    },
    plugins: [
        "@typescript-eslint",
    ],
    rules: {
        indent: "off",
        "linebreak-style": "off",
        quotes: [
            "error",
            "single"
        ],
        semi: [
            "error",
            "always"
        ],
        'no-unused-vars': "off",
    }
};