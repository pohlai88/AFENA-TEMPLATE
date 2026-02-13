const baseConfig = require('afena-eslint-config/base');

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
      // packages/crud IS the kernel — it is allowed to use db.insert/update/delete
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.object.name='console']",
          message: 'Use afena-logger instead of console.* (INVARIANT-08)',
        },
        {
          selector: "CallExpression[callee.object.property.name='console']",
          message: 'Use afena-logger instead of console.* (INVARIANT-08)',
        },
        // INVARIANT-01 db.insert/update/delete rules intentionally omitted here
      ],
    },
  },
  {
    files: ['src/mutate.ts', 'src/handlers/**/*.ts', 'src/read.ts', 'src/metering.ts', 'src/policy-engine.ts', 'src/governor.ts', 'src/services/doc-number.ts', 'src/services/fx-lookup.ts', 'src/services/fiscal-period.ts', 'src/services/tax-calc.ts', 'src/services/workflow-edit-window.ts', 'src/services/workflow-outbox.ts'],
    rules: {
      // Drizzle transaction typing: tx from db.transaction() loses schema type,
      // requiring intentional `as any` casts for insert/update/select within tx
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
    },
  },
];
