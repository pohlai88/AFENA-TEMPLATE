const baseConfig = require('afena-eslint-config/base');

module.exports = [
  {
    ignores: [
      'node_modules/**',
      '.turbo/**',
      '.next/**',
      'apps/*/.next/**',
      'apps/*/out/**',
      'packages/*/dist/**',
      'packages/*/build/**',
      'packages/eslint-config/**',
      'packages/typescript-config/**',
      'coverage/**',
      '*.config.js',
      '*.config.ts',
      '*.config.mjs',
      '**/*.d.ts',
    ],
  },
  ...baseConfig,
];
