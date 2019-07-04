module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  env: {
    node: true,
    es6: true
  },
  rules: {
    /**
     * eslint-rules
     */
    'valid-jsdoc': 'off',
    'array-bracket-spacing': ['error', 'never'],
    'no-case-declarations': 'off',
    "comma-dangle": 'off',

    /**
     * @typescript-eslint rules
     */
    '@typescript-eslint/array-type': ['error', 'generic'],
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    // note you must disable the base rule as it can report incorrect errors
    'indent': 'off',
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/interface-name-prefix': ['error', 'always'],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off'
  }
}
