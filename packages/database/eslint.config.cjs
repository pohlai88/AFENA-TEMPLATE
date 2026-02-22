const baseConfig = require('afenda-eslint-config/base');

module.exports = [
  { ignores: ['dist/**', '*.config.*', 'drizzle/**', '**/__tests__/**', 'scripts/**/*.mjs'] },
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    files: ['src/scripts/**/*.ts'],
    rules: {
      'security/detect-non-literal-fs-filename': 'off',
    },
  },
];
