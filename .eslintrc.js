module.exports = {
    extends: 'airbnb-base',
    plugins: ['import'],
    rules: {
        indent: ['error', 4],
        'comma-dangle': ['error', 'never'],
        'arrow-parens': 0,
        'max-len': 0
    },
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 6,
        ecmaFeatures: {
            experimentalObjectRestSpread: true
        }
    }
};
