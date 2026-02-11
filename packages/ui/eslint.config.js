const reactConfig = require('afena-eslint-config/react');

module.exports = [
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
