const baseConfig = require('afena-eslint-config/base');

module.exports = [
  ...baseConfig,

  {
    ignores: [
      'dist/**',
      '*.config.*',
      '**/*.test.*',
      '**/*.spec.*',
      'src/**/__tests__/**/*.bench.*',
    ],
  },

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
        // INVARIANT-01 db.insert/update/delete rules intentionally omitted here
      ],
    },
  },

  // Override A: Core files that require tx typing exceptions (explicit list)
  {
    files: [
      'src/mutate.ts',
      'src/handlers/**/*.ts',
      'src/read.ts',
      'src/metering.ts',
      'src/policy-engine.ts',
      'src/governor.ts',
    ],
    rules: {
      // EX-LINT-DRZ-TX-001: Drizzle tx typing loses schema; allow intentional any-casts
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  },

  // Override B: Services only (no-unnecessary-type-assertion kept ON)
  {
    files: ['src/services/**/*.ts'],
    rules: {
      // EX-LINT-DRZ-TX-001: Drizzle tx typing loses schema; allow intentional any-casts in services
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  },
];
