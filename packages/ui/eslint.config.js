const reactConfig = require('afena-eslint-config/react');

module.exports = [
  { ignores: ['dist/**', '*.config.*', 'engine/**'] },
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
