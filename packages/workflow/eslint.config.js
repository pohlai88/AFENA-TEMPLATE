const baseConfig = require('afena-eslint-config/base');

module.exports = [
  { ignores: ['dist/**', '*.config.*', '**/*.test.*', '**/*.spec.*'] },
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
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
          message: 'Use afena-logger instead of console.* (INVARIANT-08)',
        },
        {
          selector: "CallExpression[callee.object.property.name='console']",
          message: 'Use afena-logger instead of console.* (INVARIANT-08)',
        },
      ],
    },
  },
];
