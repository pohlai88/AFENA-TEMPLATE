/**
 * ESLint Import Pattern Rules
 *
 * Enforces the AFENDA-NEXUS import alias conventions:
 * - Cross-package: Use package names (afenda-logger, afenda-database)
 * - Internal: Use relative paths (./utils, ../types)
 * - App-level: Use @ alias (@/lib/auth, @/components/Button)
 */

module.exports = {
  rules: {
    // Enforce import order and grouping
    'import/order': [
      'error',
      {
        groups: [
          'builtin', // Node.js built-ins
          'external', // npm packages
          'internal', // afenda-* packages
          'parent', // ../
          'sibling', // ./
          'index', // ./index
          'type', // TypeScript types
        ],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'next/**',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'afenda-*',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@afenda/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@/**',
            group: 'internal',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['react', 'type'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    // Warn against using @ for cross-package imports in packages
    'no-restricted-imports': [
      'warn',
      {
        patterns: [
          {
            group: ['@/database*', '@/logger*', '@/canon*', '@/crud*'],
            message:
              'Use package names for cross-package imports: import { db } from "afenda-database"',
          },
        ],
      },
    ],
  },

  // Package-specific overrides
  overrides: [
    {
      // In packages: enforce relative imports for internal, package names for external
      files: ['packages/*/src/**/*.ts', 'packages/*/src/**/*.tsx'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@/*'],
                message:
                  'Packages should not use @ alias. Use relative imports for internal files, package names for cross-package imports.',
              },
            ],
          },
        ],
      },
    },
    {
      // In apps: @ alias is allowed and encouraged
      files: ['apps/*/app/**/*.ts', 'apps/*/app/**/*.tsx', 'apps/*/components/**/*.tsx'],
      rules: {
        'no-restricted-imports': [
          'warn',
          {
            patterns: [
              {
                group: ['../../packages/*'],
                message:
                  'Use @ alias or package names for cleaner imports: @afenda/ui or @/lib/utils',
              },
            ],
          },
        ],
      },
    },
  ],
};
