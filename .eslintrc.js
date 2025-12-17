module.exports = {
  root: true,
  extends: [
    'universe/native',
    'plugin:react-hooks/recommended',
    'plugin:@tanstack/eslint-plugin-query/recommended',
  ],
  plugins: ['simple-import-sort', 'react-native'],
  rules: {
    'import/order': 'off',
    'react/react-in-jsx-scope': 'off',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    'react-native/no-unused-styles': 'warn',
    'react-native/no-inline-styles': 'warn',
    'react/jsx-no-leaked-render': 'error',
    'react/jsx-no-bind': 'error',
  },
  overrides: [
    {
      files: '*',
      rules: {
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              ['^\\u0000'],
              ['^@?\\w'],
              ['^'],
              [
                '^(@api|@components|@context|@data|@hooks|@navigation|@screens|@store|@styles|@utils)(/.*|$)',
              ],
              ['^\\.'],
            ],
          },
        ],
      },
    },
  ],
};
