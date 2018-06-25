module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  extends: ['airbnb-base'],
  rules: {
    'func-names': 0,
    'space-before-function-paren': 0,
    'no-shadow': 0,
    'no-else-return': 0,
    'no-extend-native': 0,
    'no-underscore-dangle': 0,
    'arrow-body-style': 0,
    'prefer-arrow-callback': 0,
    'prefer-rest-params': 0,
    'consistent-return': 0,
    'generator-star-spacing': [2, 'after'],
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
};
