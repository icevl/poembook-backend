module.exports = {
    extends: 'airbnb-base',
    plugins: ['import'],
    rules: {
        indent: ['error', 4],
        'comma-dangle': ['error', 'never']
    },
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 6,
        ecmaFeatures: {
            experimentalObjectRestSpread: true
        }
    }
};
