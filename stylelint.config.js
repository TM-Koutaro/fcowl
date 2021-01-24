module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  rules: {
    'no-descending-specificity': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'define-mixin',
          'add-mixin',
          'mixin-content',
          'mixin',
          'include',
          'for',
          'function',
          'return',
        ],
      },
    ],
  },
}
