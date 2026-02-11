const baseConfig = require('afena-eslint-config/base');

module.exports = [
  { ignores: ['dist/**', '*.config.*'] },
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
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
];
