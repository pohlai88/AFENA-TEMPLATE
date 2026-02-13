const baseConfig = require('afena-eslint-config/base');

module.exports = [
  { ignores: ['dist/**', '*.config.*'] },
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
  },
];
