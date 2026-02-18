/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    // ═══════════════════════════════════════════════════════════════════
    // RULE 1: Canon purity — only zod allowed as runtime dependency
    // ═══════════════════════════════════════════════════════════════════
    {
      name: 'canon-no-workspace-imports',
      comment:
        'Canon (Layer 1) must not import any workspace package. ' +
        'It is a pure metadata catalog with zod as sole runtime dependency.',
      severity: 'error',
      from: { path: '^packages/canon/src' },
      to: {
        path: [
          '^packages/(?!canon)',
          '^business-domain/',
          '^apps/',
          '^tools/',
        ],
      },
    },
    {
      name: 'canon-only-zod-runtime',
      comment:
        'Canon runtime imports must be limited to zod. ' +
        'No other npm packages allowed at runtime.',
      severity: 'error',
      from: { path: '^packages/canon/src' },
      to: {
        dependencyTypesNot: ['local', 'localmodule'],
        pathNot: ['^node_modules/zod'],
        // Allow Node.js builtins (crypto for fingerprinting)
        moduleSystemsNot: [],
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // RULE 2: Layer boundary enforcement (supplements validate-deps.ts)
    // ═══════════════════════════════════════════════════════════════════
    {
      name: 'no-layer2-into-layer1',
      comment:
        'Layer 1 (Foundation: canon, database, logger, ui) must not import ' +
        'from Layer 2 (business-domain) or Layer 3 (apps).',
      severity: 'error',
      from: {
        path: '^packages/(canon|database|logger|ui)/src',
      },
      to: {
        path: ['^business-domain/', '^apps/'],
      },
    },
    {
      name: 'no-layer3-skipping-layers',
      comment: 'Apps may not import directly from business-domain internal files.',
      severity: 'warn',
      from: { path: '^apps/' },
      to: {
        path: '^business-domain/.*/src/',
        pathNot: '^business-domain/.*/src/index',
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // RULE 3: No circular dependencies within Canon modules
    // ═══════════════════════════════════════════════════════════════════
    {
      name: 'no-canon-circular',
      comment: 'No circular imports within Canon source files.',
      severity: 'error',
      from: { path: '^packages/canon/src' },
      to: {
        circular: true,
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // RULE 4: Canon internal module boundaries
    // ═══════════════════════════════════════════════════════════════════
    {
      name: 'canon-lite-meta-no-registry-import',
      comment:
        'lite-meta/ is pure metadata logic. It must not import from registries/ ' +
        '(registries may depend on lite-meta, not the reverse).',
      severity: 'error',
      from: { path: '^packages/canon/src/lite-meta/' },
      to: { path: '^packages/canon/src/registries/' },
    },
    {
      name: 'canon-mappings-no-registry-import',
      comment:
        'mappings/ provides type conversion. It must not import from registries/.',
      severity: 'error',
      from: { path: '^packages/canon/src/mappings/' },
      to: { path: '^packages/canon/src/registries/' },
    },
    {
      name: 'canon-enums-no-internal-import',
      comment:
        'enums/ is leaf-level vocabulary. It must not import from lite-meta/, ' +
        'mappings/, registries/, or validators/.',
      severity: 'error',
      from: { path: '^packages/canon/src/enums/' },
      to: {
        path: [
          '^packages/canon/src/lite-meta/',
          '^packages/canon/src/mappings/',
          '^packages/canon/src/registries/',
          '^packages/canon/src/validators/',
        ],
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // RULE 5: General workspace hygiene
    // ═══════════════════════════════════════════════════════════════════
    {
      name: 'no-orphaned-index-imports',
      comment: 'Do not import from package dist/ directly; use package name.',
      severity: 'warn',
      from: {},
      to: {
        path: '^packages/.*/dist/',
      },
    },
  ],

  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.json',
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
      mainFields: ['module', 'main', 'types', 'typings'],
    },
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/(@[^/]+/[^/]+|[^/]+)',
      },
      text: {
        highlightFocused: true,
      },
    },
    cache: {
      strategy: 'content',
      folder: 'node_modules/.cache/dependency-cruiser',
    },
  },
};
