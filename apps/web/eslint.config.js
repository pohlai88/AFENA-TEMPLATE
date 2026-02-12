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
  // System/infra routes that write directly (not domain truth — exempt from INVARIANT-01)
  {
    files: ['app/api/storage/**/*.ts'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
];
