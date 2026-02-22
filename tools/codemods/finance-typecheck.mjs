/**
 * Finance Type-Check Codemod (ts-morph)
 *
 * Idempotent, AST-safe transforms for mechanical type errors across
 * business-domain/finance packages. Re-runnable after future canon changes.
 *
 * Patterns:
 *   B1 — Remove unused type-only imports (zero symbol references)
 *   B2 — Prefix unused db/ctx params with _ (function-scope reference check)
 *   B3 — Rename ctx.actor.id → ctx.actor.userId (property access replacement)
 *   B4 — Convert exactOptionalPropertyTypes violations to conditional spread
 *         (whitelist only: evidenceRef, memo, note, description)
 *
 * Usage: node tools/codemods/finance-typecheck.mjs [--dry-run]
 * Output: .afenda/reports/finance-typecheck-codemod.json
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve ts-morph from afenda-cli's node_modules (pnpm strict mode)
const require = createRequire(resolve(dirname(fileURLToPath(import.meta.url)), '../afenda-cli/package.json'));
const { Project, SyntaxKind } = require('ts-morph');

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const FINANCE_DIR = resolve(ROOT, 'business-domain/finance');
const REPORT_PATH = resolve(ROOT, '.afenda/reports/finance-typecheck-codemod.json');
const DRY_RUN = process.argv.includes('--dry-run');

const counts = { B1: 0, B2: 0, B3: 0, B4: 0 };
const B4_skipped = [];
const changedFiles = new Set();

// ── Setup ts-morph project ──────────────────────────────────────────
const project = new Project({
  tsConfigFilePath: undefined,
  skipAddingFilesFromTsConfig: true,
});

// Add all finance .ts source files (exclude dist, node_modules, __tests__)
const globPattern = `${FINANCE_DIR}/**/src/**/*.ts`;
project.addSourceFilesAtPaths(globPattern);

// Remove files in excluded dirs
for (const sf of project.getSourceFiles()) {
  const fp = sf.getFilePath();
  if (fp.includes('/dist/') || fp.includes('/node_modules/') || fp.includes('/__tests__/') ||
    fp.includes('\\dist\\') || fp.includes('\\node_modules\\') || fp.includes('\\__tests__\\')) {
    project.removeSourceFile(sf);
  }
}

console.log(`Scanning ${project.getSourceFiles().length} files...`);

// ── B1: Remove unused type-only imports ─────────────────────────────
for (const sourceFile of project.getSourceFiles()) {
  for (const importDecl of sourceFile.getImportDeclarations()) {
    if (!importDecl.isTypeOnly()) continue;

    const namedImports = importDecl.getNamedImports();
    const removable = [];

    for (const named of namedImports) {
      const name = named.getName();
      // Check if the identifier has any references beyond the import itself
      const refs = sourceFile.getDescendantsOfKind(SyntaxKind.Identifier)
        .filter(id => id.getText() === name && id !== named.getNameNode());

      if (refs.length === 0) {
        removable.push(named);
      }
    }

    if (removable.length === namedImports.length && removable.length > 0) {
      // All named imports unused — remove entire declaration
      if (!DRY_RUN) importDecl.remove();
      counts.B1++;
      changedFiles.add(sourceFile.getFilePath());
    } else {
      for (const named of removable) {
        if (!DRY_RUN) named.remove();
        counts.B1++;
        changedFiles.add(sourceFile.getFilePath());
      }
    }
  }
}

// ── B2: Prefix unused db/ctx params with _ ──────────────────────────
const PARAM_NAMES = new Set(['db', 'ctx']);

for (const sourceFile of project.getSourceFiles()) {
  for (const fn of [
    ...sourceFile.getFunctions(),
    ...sourceFile.getDescendantsOfKind(SyntaxKind.ArrowFunction),
    ...sourceFile.getDescendantsOfKind(SyntaxKind.MethodDeclaration),
  ]) {
    for (const param of fn.getParameters()) {
      const name = param.getName();
      if (!PARAM_NAMES.has(name)) continue;
      if (name.startsWith('_')) continue;

      // Check if param is referenced in the function body
      const body = fn.getBody?.();
      if (!body) continue;

      const refs = body.getDescendantsOfKind(SyntaxKind.Identifier)
        .filter(id => id.getText() === name);

      if (refs.length === 0) {
        if (!DRY_RUN) param.rename(`_${name}`);
        counts.B2++;
        changedFiles.add(sourceFile.getFilePath());
      }
    }
  }
}

// ── B3: Rename ctx.actor.id → ctx.actor.userId ─────────────────────
for (const sourceFile of project.getSourceFiles()) {
  for (const propAccess of sourceFile.getDescendantsOfKind(SyntaxKind.PropertyAccessExpression)) {
    if (propAccess.getName() !== 'id') continue;

    const expr = propAccess.getExpression();
    if (expr.getKind() !== SyntaxKind.PropertyAccessExpression) continue;

    const parentAccess = expr;
    if (parentAccess.getText().endsWith('.actor')) {
      // Check grandparent is ctx-like (ctx.actor.id)
      const grandparent = parentAccess.getExpression();
      const gpText = grandparent.getText();
      if (gpText === 'ctx' || gpText.endsWith('ctx')) {
        if (!DRY_RUN) propAccess.getNameNode().replaceWithText('userId');
        counts.B3++;
        changedFiles.add(sourceFile.getFilePath());
      }
    }
  }
}

// ── B4: exactOptionalPropertyTypes → conditional spread ─────────────
// Only fix KNOWN violations from the plan. Do not auto-detect — too risky.
// Known: close-service.ts line ~120 (evidenceRef)
const B4_KNOWN_FIXES = [
  { filePattern: 'financial-close/src/services/close-service.ts', prop: 'evidenceRef' },
];

for (const sourceFile of project.getSourceFiles()) {
  const filePath = sourceFile.getFilePath().replace(/\\/g, '/');
  const knownForFile = B4_KNOWN_FIXES.filter(k => filePath.includes(k.filePattern));
  if (knownForFile.length === 0) continue;

  for (const objLit of sourceFile.getDescendantsOfKind(SyntaxKind.ObjectLiteralExpression)) {
    for (const prop of objLit.getProperties()) {
      if (prop.getKind() !== SyntaxKind.PropertyAssignment) continue;

      const propAssign = prop;
      const propName = propAssign.getName();
      const known = knownForFile.find(k => k.prop === propName);
      if (!known) continue;

      const init = propAssign.getInitializer();
      if (!init) continue;

      // Check if already using conditional spread pattern
      const siblings = objLit.getProperties();
      const alreadySpread = siblings.some(s =>
        s.getKind() === SyntaxKind.SpreadAssignment &&
        s.getText().includes(propName)
      );
      if (alreadySpread) continue;

      const valueText = init.getText();
      const spreadText = `...(${valueText} ? { ${propName}: ${valueText} } : {})`;

      if (!DRY_RUN) {
        propAssign.replaceWithText(spreadText);
      }
      counts.B4++;
      changedFiles.add(sourceFile.getFilePath());
    }
  }
}

// ── Save changes ────────────────────────────────────────────────────
if (!DRY_RUN) {
  project.saveSync();
}

// ── Emit report ─────────────────────────────────────────────────────
const report = {
  dryRun: DRY_RUN,
  filesChanged: changedFiles.size,
  patterns: counts,
  B4_skipped,
};

const reportDir = dirname(REPORT_PATH);
if (!existsSync(reportDir)) {
  mkdirSync(reportDir, { recursive: true });
}
writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n');

console.log('\n=== Finance Type-Check Codemod Report ===');
console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'APPLIED'}`);
console.log(`Files changed: ${changedFiles.size}`);
console.log(`B1 (unused imports): ${counts.B1}`);
console.log(`B2 (unused params): ${counts.B2}`);
console.log(`B3 (actor.id → userId): ${counts.B3}`);
console.log(`B4 (optional props): ${counts.B4}`);
if (B4_skipped.length > 0) {
  console.log(`B4 skipped (not whitelisted): ${B4_skipped.length}`);
}
console.log(`\nReport: ${REPORT_PATH}`);
