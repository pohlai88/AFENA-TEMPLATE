const reactConfig = require('afena-eslint-config/react');

module.exports = [
  { ignores: ['dist/**', '*.config.*'] },
  ...reactConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
  },
];
