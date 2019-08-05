module.exports = {
    env: {
        browser: true,
        es6: true
    },
    extends: [
        'standard'
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
    },
    parserOptions: {
        ecmaVersion: 2018
    },
    rules: {
        // 允许使用分号
        'semi': [0, 'never'],
        // 允许使用==
        'eqeqeq': 0
    }
}