import baseConfig from 'afenda-eslint-config/base.js';

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  ...baseConfig,
  
  // Drizzle transaction typing workaround (EX-LINT-DRZ-TX-001)
  // These files use Drizzle ORM transactions which have known TypeScript limitations
  {
    files: ['src/services/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      // KEEP ON - catches real bugs:
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    },
  },
];

