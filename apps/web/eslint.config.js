const nextConfig = require('afena-eslint-config/next');

module.exports = [
  { ignores: ['.next/**', 'dist/**', '*.config.*', 'src/types/**'] },
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
