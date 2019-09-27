module.exports = {
    extends: 'airbnb-base',
    plugins: ['import'],
    rules: {
        indent: ['error', 4],
        'comma-dangle': ['error', 'never'],
        'arrow-parens': 0,
        'no-param-reassign': 0,
        'max-len': 0,
        'no-confusing-arrow': 0
    },
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2017,
        ecmaFeatures: {
            experimentalObjectRestSpread: true
        }
    }
};
