import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { safeMkdir, safeWriteFile } from '../core/fs-safe';
import { log } from '../core/logger';

export interface DomainNewOptions {
  repoRoot: string;
  familyName: string;
  packageName: string;
  dryRun?: boolean;
}

interface ScaffoldFile {
  path: string;
  content: string;
}

function packageJsonContent(packageName: string): string {
  return JSON.stringify(
    {
      name: `afenda-${packageName}`,
      version: '0.1.0',
      private: true,
      type: 'module',
      main: './src/index.ts',
      types: './src/index.ts',
      exports: {
        '.': {
          types: './src/index.ts',
          default: './src/index.ts',
        },
      },
      scripts: {
        'type-check': 'tsc --noEmit',
        test: 'vitest run',
        'test:watch': 'vitest',
        lint: 'eslint src --ext .ts --cache',
        'lint:fix': 'eslint src --ext .ts --cache --fix',
        'lint:ci': "eslint src --ext .ts --rule 'import/no-cycle: error'",
      },
      dependencies: {
        'afenda-canon': 'workspace:*',
        'afenda-database': 'workspace:*',
        'afenda-logger': 'workspace:*',
      },
      devDependencies: {
        'afenda-eslint-config': 'workspace:*',
        'afenda-typescript-config': 'workspace:*',
        'drizzle-orm': 'catalog:',
        typescript: 'catalog:',
        vitest: 'catalog:',
      },
    },
    null,
    2,
  );
}

function tsconfigContent(): string {
  return JSON.stringify(
    {
      extends: 'afenda-typescript-config/react-library.json',
      compilerOptions: {
        tsBuildInfoFile: './dist/.tsbuildinfo',
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist', 'build', '**/*.test.*', '**/*.spec.*'],
    },
    null,
    2,
  );
}

function eslintConfigContent(): string {
  return `const domainConfig = require('afenda-eslint-config/domain');

module.exports = [...domainConfig(__dirname)];
`;
}

function vitestConfigContent(packageName: string, depth: number): string {
  const up = '../'.repeat(depth);
  return `import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      'afenda-canon': resolve(__dirname, '${up}packages/canon/src/index.ts'),
      'afenda-database': resolve(__dirname, '${up}packages/database/src/index.ts'),
    },
  },
  test: {
    name: 'afenda-${packageName}',
    globals: true,
    pool: 'threads',
    include: ['src/**/__tests__/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    testTimeout: 5000,
    passWithNoTests: true,
  },
});
`;
}

function indexContent(_packageName: string): string {
  return `export {};
`;
}

function readmeContent(packageName: string, familyName: string): string {
  return `# afenda-${packageName}

Business domain package — \`${familyName}/${packageName}\`.

## Responsibilities

- TODO: describe what this domain package owns

## Invariants

- Returns \`DomainIntent[]\` for all mutations (never writes to DB directly)
- Uses \`ctx.asOf\` instead of \`new Date()\`
- Throws \`DomainError\` instead of raw \`Error\`

## Structure

\`\`\`
src/
├── index.ts          — public API barrel
├── calculators/      — pure deterministic functions
├── commands/         — intent builders
├── queries/          — read-only DB queries
├── services/         — orchestration (queries + calculators + intents)
└── __tests__/        — unit tests
\`\`\`
`;
}

function buildScaffold(opts: DomainNewOptions): ScaffoldFile[] {
  const { familyName, packageName } = opts;
  const depth = 3; // business-domain/<family>/<name> → 3 levels up to repo root

  return [
    { path: 'package.json', content: packageJsonContent(packageName) },
    { path: 'tsconfig.json', content: tsconfigContent() },
    { path: 'eslint.config.cjs', content: eslintConfigContent() },
    { path: 'vitest.config.ts', content: vitestConfigContent(packageName, depth) },
    { path: 'README.md', content: readmeContent(packageName, familyName) },
    { path: 'src/index.ts', content: indexContent(packageName) },
    { path: 'src/calculators/.gitkeep', content: '' },
    { path: 'src/commands/.gitkeep', content: '' },
    { path: 'src/queries/.gitkeep', content: '' },
    { path: 'src/services/.gitkeep', content: '' },
    { path: 'src/__tests__/.gitkeep', content: '' },
  ];
}

function addRootTsconfigRef(repoRoot: string, _relPath: string, _dryRun: boolean): boolean {
  log.dim(`  tsconfig.json: source-first packages do not need project references`);
  void repoRoot;
  return false;
}


function incrementDomainPackageCount(repoRoot: string, dryRun: boolean): void {
  const taxonomyPath = join(
    repoRoot,
    'packages',
    'canon',
    'src',
    'registries',
    'domain-taxonomy.ts',
  );
  if (!existsSync(taxonomyPath)) {
    log.warn('  domain-taxonomy.ts not found — update DOMAIN_PACKAGE_COUNT manually.');
    return;
  }

  const raw = readFileSync(taxonomyPath, 'utf-8');
  const match = raw.match(/DOMAIN_PACKAGE_COUNT\s*=\s*(\d+)/);
  if (!match) {
    log.warn('  Could not parse DOMAIN_PACKAGE_COUNT — update manually.');
    return;
  }

  const current = parseInt(match[1], 10);
  const next = current + 1;
  const updated = raw.replace(
    /DOMAIN_PACKAGE_COUNT\s*=\s*\d+/,
    `DOMAIN_PACKAGE_COUNT = ${next}`,
  );

  if (!dryRun) {
    writeFileSync(taxonomyPath, updated, 'utf-8');
  }
  log.success(`  DOMAIN_PACKAGE_COUNT: ${current} → ${next}`);
}

export function runDomainNew(opts: DomainNewOptions): void {
  const { repoRoot, familyName, packageName, dryRun = false } = opts;

  const pkgDir = join(repoRoot, 'business-domain', familyName, packageName);
  const relPath = `business-domain/${familyName}/${packageName}`;

  log.bold(`\nafenda domain new ${familyName}/${packageName}\n`);

  if (existsSync(pkgDir)) {
    log.error(`Package directory already exists: ${pkgDir}`);
    process.exitCode = 1;
    return;
  }

  const files = buildScaffold(opts);

  log.info(`${dryRun ? '[dry-run] ' : ''}Scaffolding ${files.length} files into ${relPath}/\n`);

  for (const file of files) {
    log.dim(`  + ${file.path}`);
    if (!dryRun) {
      safeMkdir(repoRoot, 'business-domain', familyName, packageName, ...file.path.split('/').slice(0, -1));
      safeWriteFile(repoRoot, file.content, 'business-domain', familyName, packageName, ...file.path.split('/'));
    }
  }

  log.info('\nWiring:\n');

  const refAdded = addRootTsconfigRef(repoRoot, relPath, dryRun);
  if (refAdded) {
    log.success(`  tsconfig.json reference added`);
  }

  incrementDomainPackageCount(repoRoot, dryRun);

  log.info('\nNext steps:\n');
  log.info(`  1. pnpm install`);
  log.info(`  2. pnpm --filter afenda-${packageName} type-check`);
  log.info(`  3. Add intent types to packages/canon/src/types/domain-intent.ts`);
  log.info(`  4. Register in packages/canon/src/registries/domain-intent-registry.ts`);
  log.info(`  5. pnpm ci:domain-gates\n`);
}
