/**
 * Shared ESLint rules for business-domain/ packages.
 *
 * Usage in each domain package's eslint.config.cjs:
 *   const domainConfig = require('afenda-eslint-config/domain');
 *   module.exports = [...domainConfig(__dirname)];
 */

const baseConfig = require('./base');
const tseslint = require('typescript-eslint');

/**
 * @param {string} tsconfigRootDir — __dirname of the consuming package
 */
function domainConfig(tsconfigRootDir) {
  return [
    { ignores: ['dist/**', '*.config.*'] },
    ...baseConfig,
    {
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir,
        },
      },
      rules: {
        // INV-DOM-04 / INV-L04: Domain layer must not write to DB directly
        'no-restricted-syntax': [
          'error',
          {
            selector:
              "CallExpression[callee.property.name=/^(insert|update|delete|execute|transaction)$/]",
            message:
              'Domain layer may not write to DB. Return DomainIntent[] to afenda-crud.',
          },
          // INV-C03: No new Date() — use ctx.asOf or pass time explicitly
          {
            selector: "NewExpression[callee.name='Date']",
            message:
              'Do not use new Date() in business-domain. Use ctx.asOf or pass time explicitly (INV-C03).',
          },
          // INV-DOM-03: Must throw DomainError, not raw Error/RangeError/TypeError
          {
            selector: "ThrowStatement > NewExpression[callee.name='Error']",
            message: 'Throw DomainError (from afenda-canon) only (INV-DOM-03).',
          },
          {
            selector: "ThrowStatement > NewExpression[callee.name='RangeError']",
            message: 'Throw DomainError (from afenda-canon) instead of RangeError (INV-DOM-03).',
          },
          {
            selector: "ThrowStatement > NewExpression[callee.name='TypeError']",
            message: 'Throw DomainError (from afenda-canon) instead of TypeError (INV-DOM-03).',
          },
        ],
      },
    },
    // Disable type-checked rules for test files excluded from tsconfig.
    // Non-type-checked rules (import/order, no-restricted-syntax, etc.) still apply.
    {
      files: ['**/*.test.*', '**/*.spec.*'],
      ...tseslint.configs.disableTypeChecked,
    },
  ];
}

module.exports = domainConfig;
