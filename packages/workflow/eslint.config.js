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
  },
  {
    files: ['src/engine.ts'],
    rules: {
      // engine.ts writes to workflow_executions (append-only evidence table)
      // via fire-and-forget db.insert() — not domain data, exempt from INVARIANT-01
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
    files: ['src/v2/nodes/*.ts'],
    rules: {
      // Node handlers implement async WorkflowNodeHandler interface but may return sync results
      '@typescript-eslint/require-await': 'off',
    },
  },
];
