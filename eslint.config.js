const baseConfig = require('afena-eslint-config/base');

module.exports = [
  ...baseConfig,
  {
    ignores: [
      'apps/*/.next/**',
      'apps/*/out/**',
      'packages/*/dist/**',
      'packages/*/build/**',
      'node_modules/**',
      '.turbo/**',
      '*.config.js',
      '*.config.ts',
    ],
  },
];
