const nextConfig = require('afena-eslint-config/next');

module.exports = [
  ...nextConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
  },
];
