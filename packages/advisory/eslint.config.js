const baseConfig = require('afenda-eslint-config/base');

module.exports = [
  { ignores: ['dist/**', '*.config.*', '**/*.test.*', '**/*.spec.*'] },
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // packages/advisory does read-only queries + writes to advisory tables only
      // INVARIANT-01 db.insert/update/delete rules intentionally omitted here
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.object.name='console']",
          message: 'Use afenda-logger instead of console.* (INVARIANT-08)',
        },
        {
          selector: "CallExpression[callee.object.property.name='console']",
          message: 'Use afenda-logger instead of console.* (INVARIANT-08)',
        },
      ],
    },
  },
  {
    files: [
      'src/explain/**/*.ts',
      'src/detectors/**/*.ts',
      'src/forecasters/**/*.ts',
      'src/scoring/**/*.ts',
      'src/fingerprint.ts',
      'src/writer.ts',
    ],
    rules: {
      // Math/stats modules: array indexing within bounds-checked loops is safe,
      // template params are always primitives at runtime (display-only strings)
      '@typescript-eslint/no-base-to-string': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
    },
  },
];
