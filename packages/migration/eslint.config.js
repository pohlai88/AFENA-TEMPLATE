const baseConfig = require('afenda-eslint-config/base');

module.exports = [
  { ignores: ['dist/**', '*.config.*', 'src/__tests__/**'] },
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
  },
];
