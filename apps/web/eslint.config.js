const nextConfig = require('afena-eslint-config/next');

module.exports = [
  { ignores: ['.next/**', 'dist/**', '*.config.*', 'src/types/**', 'scripts/**'] },
  ...nextConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
  },
  // System/infra routes that write directly (not domain truth — exempt from INVARIANT-01)
  {
    files: ['app/api/storage/**/*.ts'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
  // CI scripts — console output acceptable
  {
    files: ['tools/**/*.ts'],
    rules: {
      'no-console': 'off',
      'no-restricted-syntax': 'off',
    },
  },
  // ── API/Route Architecture (plan: api_and_route_architecture) ──
  // B1) No raw /api/ or /org/ strings — use src/lib/routes/*.ts builders
  {
    files: ['**/*.{ts,tsx}'],
    ignores: [
      'src/lib/routes/**',
      'src/lib/api/route-manifest.ts',
      'app/api/**/route.ts',
      'src/lib/api/openapi-spec.ts',
      'tools/route-governance/**',
      'e2e/**',
      'proxy.ts',
    ],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/^\\/api\\//]',
          message:
            'Use src/lib/routes/{api-v1,bff,admin}.ts builders instead of raw /api/ strings.',
        },
        {
          selector: 'Literal[value=/^\\/org\\//]',
          message: 'Use src/lib/routes/app-routes.ts builders instead of raw /org/ strings.',
        },
      ],
    },
  },
  // B2) No Second CRUD Stack — boundary modules only may import kernel/DB
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['app/api/delivery-notes/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@afena/database',
              message: 'Kernel only in boundary modules (entity-route-handlers, entity-actions).',
            },
            {
              name: 'afena-database',
              message: 'Kernel only in boundary modules (entity-route-handlers, entity-actions).',
            },
            {
              name: 'drizzle-orm',
              message: 'Do not import from adapters; use kernel via boundary modules.',
            },
            {
              name: 'afena-crud',
              message: 'Kernel only in boundary modules (entity-route-handlers, entity-actions).',
            },
          ],
          patterns: [
            {
              group: ['**/schema/**', '**/repositories/**'],
              message: 'Do not import schema/repositories; use kernel via boundary modules.',
            },
            {
              group: ['**/packages/crud/**', '**/afena-crud/**'],
              message: 'Kernel only in boundary modules (entity-route-handlers, entity-actions).',
            },
          ],
        },
      ],
    },
  },
  // Route handlers — must use entity-route-handlers only (stricter message)
  {
    files: ['app/api/**/route.ts'],
    ignores: ['app/api/storage/**', 'app/api/views/**', 'app/api/webhooks/**', 'app/api/internal/search/**', 'app/api/delivery-notes/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@afena/database',
              message: 'Routes must use entity-route-handlers only; do not import DB directly.',
            },
            {
              name: 'afena-database',
              message: 'Routes must use entity-route-handlers only; do not import DB directly.',
            },
            {
              name: 'drizzle-orm',
              message: 'Routes must use entity-route-handlers only.',
            },
            {
              name: 'afena-crud',
              message: 'Routes must use entity-route-handlers only; do not import crud directly.',
            },
          ],
          patterns: [
            {
              group: ['**/schema/**', '**/repositories/**'],
              message: 'Routes must use entity-route-handlers only.',
            },
            {
              group: ['**/packages/crud/**', '**/afena-crud/**'],
              message: 'Routes must use entity-route-handlers only.',
            },
          ],
        },
      ],
    },
  },
  // Server actions — must use entity-actions / generateEntityActions only
  {
    files: ['app/actions/**', 'app/**/*server-actions*.ts'],
    ignores: ['app/actions/roles.ts', 'app/actions/workflows.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@afena/database',
              message: 'Server actions must use entity-actions / generateEntityActions only.',
            },
            {
              name: 'afena-database',
              message: 'Server actions must use entity-actions / generateEntityActions only.',
            },
            {
              name: 'drizzle-orm',
              message: 'Server actions must use entity-actions only.',
            },
            {
              name: 'afena-crud',
              message: 'Server actions must use entity-actions / generateEntityActions only.',
            },
          ],
          patterns: [
            {
              group: ['**/schema/**', '**/repositories/**'],
              message: 'Server actions must use entity-actions only.',
            },
            {
              group: ['**/packages/crud/**', '**/afena-crud/**'],
              message: 'Server actions must use entity-actions only.',
            },
          ],
        },
      ],
    },
  },
  // Boundary modules — allow kernel/DB imports (domain CRUD + auth/shell + system admin + infra)
  // Must come last so it overrides the stricter route/action rules for these files
  {
    files: [
      'src/lib/api/entity-route-handlers.ts',
      'src/lib/actions/entity-actions.ts',
      'src/lib/api/with-auth.ts',
      'src/lib/api/with-auth-or-api-key.ts',
      'src/lib/api/with-api-key.ts',
      'src/lib/actions/context.ts',
      'src/lib/actions/with-action-auth.ts',
      'src/lib/org.ts',
      '**/org-context_server.ts',
      '**/roles.query_server.ts',
      '**/permissions-table_client.tsx',
      'app/actions/roles.ts',
      'app/actions/workflows.ts',
      'app/api/storage/**/*.ts',
      'app/api/views/**/*.ts',
      'app/api/webhooks/**/*.ts',
      'app/api/internal/search/**/*.ts',
      'app/(app)/org/**/page.tsx',
    ],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
];
