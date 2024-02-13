module.exports = {
  root: true,
  extends: [
    'universe/native',
    'plugin:@tanstack/eslint-plugin-query/recommended',
  ],
  plugins: ['simple-import-sort'],
  rules: {
    'import/order': 'off',
    'react/react-in-jsx-scope': 'off',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
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
              ['^(@mc-builder)(/.*|$)'],
              ['^\\.'],
            ],
          },
        ],
      },
    },
  ],
};
