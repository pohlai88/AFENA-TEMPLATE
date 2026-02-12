const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const security = require('eslint-plugin-security');
const importPlugin = require('eslint-plugin-import');
const pinoPlugin = require('eslint-plugin-pino');

module.exports = [
  // ── Base rules (all files) ──────────────────────────────────
  js.configs.recommended,
  ...tseslint.configs.recommended,
  security.configs.recommended,
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      security,
      import: importPlugin,
      pino: pinoPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        React: true,
        JSX: true,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      // TypeScript rules (non-type-checked — safe for all files)
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // Import rules
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-duplicates': 'error',
      'import/no-cycle': 'error',

      // Security rules
      'security/detect-object-injection': 'off', // Too noisy for general use

      // Pino rules — catch wrong argument order (logger.info('msg', obj) silently drops obj)
      'pino/correct-args-position': 'error',

      // General rules — Pino enforcement (INVARIANT-08)
      'no-console': 'error',
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
        {
          selector: "CallExpression[callee.object.name='db'][callee.property.name='insert']",
          message: 'Direct db.insert() is forbidden — use mutate() from afena-crud (INVARIANT-01/K-01)',
        },
        {
          selector: "CallExpression[callee.object.name='db'][callee.property.name='update']",
          message: 'Direct db.update() is forbidden — use mutate() from afena-crud (INVARIANT-01/K-01)',
        },
        {
          selector: "CallExpression[callee.object.name='db'][callee.property.name='delete']",
          message: 'Direct db.delete() is forbidden — use mutate() from afena-crud (INVARIANT-01/K-01)',
        },
        {
          selector: "CallExpression[callee.object.name='dbRo'][callee.property.name='insert']",
          message: 'dbRo.insert() is forbidden — read replica is read-only (INVARIANT-RO)',
        },
        {
          selector: "CallExpression[callee.object.name='dbRo'][callee.property.name='update']",
          message: 'dbRo.update() is forbidden — read replica is read-only (INVARIANT-RO)',
        },
        {
          selector: "CallExpression[callee.object.name='dbRo'][callee.property.name='delete']",
          message: 'dbRo.delete() is forbidden — read replica is read-only (INVARIANT-RO)',
        },
      ],
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
    },
  },

  // ── Type-checked rules (TS/TSX only — requires tsconfig) ────
  ...tseslint.configs.recommendedTypeCheckedOnly.map((cfg) => ({
    ...cfg,
    files: ['**/*.ts', '**/*.tsx'],
  })),
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    rules: {
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/return-await': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
    },
  },

  // ── Test file overrides ─────────────────────────────────────
  {
    files: ['**/*.test.*', '**/*.spec.*'],
    languageOptions: {
      globals: {
        jest: true,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'security/detect-object-injection': 'off',
    },
  },
];
