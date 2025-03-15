module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
    webextensions: true, // Add this line to recognize chrome and browser globals
  },
  rules: {
    // Add custom rules here
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': 'off', // Allow console.log for debugging
  },
  globals: {
    chrome: 'readonly' // Explicitly define chrome as a global variable
  }
};
