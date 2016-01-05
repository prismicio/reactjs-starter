/*eslint-env node */
module.exports = {
  'rules': {
    'indent': [1, 2],
    'quotes': [1, 'single'],
    'linebreak-style': [2, 'unix'],
    'no-unused-vars': [2, {'args': 'none'}],
    'semi': [2, 'always']
  },
  'env': {
    'es6': true,
    'browser': true
  },
  'extends': 'eslint:recommended',
  'ecmaFeatures': {
    'jsx': true,
    'modules': true,
    'experimentalObjectRestSpread': true
  },
  'plugins': [
    'react'
  ]
};
