const baseConfig = require('afena-eslint-config/base');

module.exports = [
  ...baseConfig,

  {
    ignores: ['dist/**', '**/*.config.*'],
  },

  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
      },
    },
  },

  // Type-aware only for src/ (exclude templates)
  {
    files: ['src/**/*.ts'],
    ignores: ['src/**/generated/**', '**/*.template.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
  },

  // EX-LINT-CLI-00 (expires: 2026-03-15): CLI tools use console for stdout.
  // Application code uses afena-logger; CLI is exempt.
  {
    files: ['src/**/*.ts'],
    rules: {
      'no-console': 'off',
      'no-restricted-syntax': [
        'error',
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
    },
  },

  // EX-LINT-CLI-FS-001 (expires: 2026-03-15): fs-safe.ts and parse-json.ts are the fs boundary.
  // All paths validated via resolveWithin. Other code must use fs-safe.
  {
    files: ['src/core/fs-safe.ts', 'src/core/parse-json.ts'],
    rules: {
      'security/detect-non-literal-fs-filename': 'off',
    },
  },

  // EX-LINT-CLI-002 (expires: 2026-03-15): Adapter/capability files not yet migrated.
  // Will be removed as fs-safe + parseJson migration completes.
  // EX-LINT-CLI-REGEX-001: detect-unsafe-regex off for trusted repo source scans.
  {
    files: [
      'src/capability/**/*.ts',
      'src/cli.ts',
      'src/discovery/**/*.ts',
      'src/core/paths.ts',
      'src/core/report-builder.ts',
      'src/core/exec.ts',
    ],
    rules: {
      'security/detect-non-literal-fs-filename': 'off',
      'security/detect-unsafe-regex': 'off',
      '@typescript-eslint/require-await': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];
