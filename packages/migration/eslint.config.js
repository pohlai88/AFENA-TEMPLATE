const baseConfig = require('afena-eslint-config/base');

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
