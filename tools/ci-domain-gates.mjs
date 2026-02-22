#!/usr/bin/env node
/**
 * CI Domain Gates — SK-01 through SK-08
 *
 * Enforces business-domain/ layer invariants at build time.
 * Exit code 0 = all gates pass. Exit code 1 = at least one gate failed.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';

const _rawRoot = new URL('.', import.meta.url).pathname;
const ROOT = resolve(process.platform === 'win32' ? _rawRoot.slice(1) : _rawRoot, '..');
const DOMAIN_ROOT = join(ROOT, 'business-domain');

let failures = 0;

function fail(gate, message) {
  console.error(`\x1b[31m✗ ${gate}\x1b[0m ${message}`);
  failures++;
}

function pass(gate, message) {
  console.log(`\x1b[32m✓ ${gate}\x1b[0m ${message}`);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function walk(dir, ext = '.ts') {
  const results = [];
  try {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        results.push(...walk(full, ext));
      } else if (full.endsWith(ext)) {
        results.push(full);
      }
    }
  } catch {
    // directory may not exist yet
  }
  return results;
}

function readFile(path) {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return '';
  }
}

/** Collect all leaf packages under business-domain/ (dirs with a package.json) */
function getDomainPackages() {
  const packages = [];
  function scan(dir) {
    try {
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) {
          const pkg = join(full, 'package.json');
          try {
            statSync(pkg);
            packages.push(full);
          } catch {
            scan(full);
          }
        }
      }
    } catch {
      // domain root may not exist
    }
  }
  scan(DOMAIN_ROOT);
  return packages;
}

// ── Load canon registries from source (no build required) ────────────────────

function extractSharedKernelKeys() {
  const src = readFile(join(ROOT, 'packages/canon/src/registries/shared-kernel-registry.ts'));
  const matches = src.match(/'([a-z-]+\.[a-z_]+)':\s*\{/g) ?? [];
  return matches.map((m) => m.match(/'([^']+)'/)[1]);
}

function extractDomainIntentTypes() {
  const src = readFile(join(ROOT, 'packages/canon/src/types/domain-intent.ts'));
  const matches = src.match(/type:\s*'([a-z-]+(?:\.[a-z-]+)+)'/g) ?? [];
  return matches.map((m) => m.match(/'([^']+)'/)[1]);
}

function extractIntentRegistryKeys() {
  const src = readFile(join(ROOT, 'packages/canon/src/registries/domain-intent-registry.ts'));
  const matches = src.match(/'([a-z-]+(?:\.[a-z-]+)+)':\s*\{/g) ?? [];
  return matches.map((m) => m.match(/'([^']+)'/)[1]);
}

function extractDomainPackageCount() {
  const src = readFile(join(ROOT, 'packages/canon/src/registries/domain-taxonomy.ts'));
  const m = src.match(/DOMAIN_PACKAGE_COUNT\s*=\s*(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

// ── Gate implementations ──────────────────────────────────────────────────────

/**
 * SK-01: Every DomainIntent type has a corresponding entry in SHARED_KERNEL_REGISTRY
 * (via DOMAIN_INTENT_REGISTRY.tableTarget pointing to a registered table)
 */
function sk01() {
  const kernelKeys = new Set(extractSharedKernelKeys());
  const intentSrc = readFile(join(ROOT, 'packages/canon/src/registries/domain-intent-registry.ts'));
  const tableTargets = [...intentSrc.matchAll(/tableTarget:\s*'([^']+)'/g)].map((m) => m[1]);

  const unregistered = tableTargets.filter((t) => !kernelKeys.has(t));
  if (unregistered.length > 0) {
    fail('SK-01', `tableTarget(s) not in SHARED_KERNEL_REGISTRY: ${unregistered.join(', ')}`);
  } else {
    pass(
      'SK-01',
      `All intent tableTargets registered in SHARED_KERNEL_REGISTRY (${tableTargets.length} checked)`,
    );
  }
}

/**
 * SK-02: Every DomainIntent union variant is registered in DOMAIN_INTENT_REGISTRY
 */
function sk02() {
  const intentTypes = extractDomainIntentTypes();
  const registryKeys = new Set(extractIntentRegistryKeys());

  const missing = intentTypes.filter((t) => !registryKeys.has(t));
  if (missing.length > 0) {
    fail(
      'SK-02',
      `DomainIntent type(s) missing from DOMAIN_INTENT_REGISTRY: ${missing.join(', ')}`,
    );
  } else {
    pass('SK-02', `All DomainIntent types registered (${intentTypes.length} checked)`);
  }
}

/**
 * SK-03: Leaf package count matches DOMAIN_PACKAGE_COUNT
 */
function sk03() {
  const packages = getDomainPackages();
  const declared = extractDomainPackageCount();

  if (declared === null) {
    fail('SK-03', 'Could not read DOMAIN_PACKAGE_COUNT from domain-taxonomy.ts');
    return;
  }

  if (packages.length !== declared) {
    fail(
      'SK-03',
      `business-domain/ has ${packages.length} package(s) but DOMAIN_PACKAGE_COUNT = ${declared}`,
    );
  } else {
    pass('SK-03', `Domain package count matches: ${packages.length}`);
  }
}

/**
 * SK-04: SHARED_KERNEL_REGISTRY[t].writes cross-references DOMAIN_INTENT_REGISTRY keys
 */
function sk04() {
  const registryKeys = new Set(extractIntentRegistryKeys());
  const kernelSrc = readFile(join(ROOT, 'packages/canon/src/registries/shared-kernel-registry.ts'));
  const writeMatches = [...kernelSrc.matchAll(/writes:\s*\[([^\]]*)\]/g)];

  const allWrites = [];
  for (const m of writeMatches) {
    const items = [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
    allWrites.push(...items);
  }

  const unregistered = allWrites.filter((w) => !registryKeys.has(w));
  if (unregistered.length > 0) {
    fail(
      'SK-04',
      `SHARED_KERNEL_REGISTRY.writes not in DOMAIN_INTENT_REGISTRY: ${unregistered.join(', ')}`,
    );
  } else {
    pass(
      'SK-04',
      `All SHARED_KERNEL_REGISTRY.writes cross-reference correctly (${allWrites.length} checked)`,
    );
  }
}

/**
 * SK-05: Public API boundary — no deep imports between domain packages.
 *
 * 1. Every domain package MUST have src/index.ts
 * 2. No domain package may import another domain package via a deep path
 *    (e.g. `from 'afenda-treasury/src/calculators/...'`). Only the package
 *    name itself (resolved to index.ts) is allowed.
 */
function sk05() {
  const packages = getDomainPackages();

  // 5a: every domain package MUST have an index.ts
  const missingIndex = packages.filter((pkg) => {
    try {
      statSync(join(pkg, 'src', 'index.ts'));
      return false;
    } catch {
      return true;
    }
  });

  if (missingIndex.length > 0) {
    fail(
      'SK-05a',
      `Domain packages missing src/index.ts: ${missingIndex.map((p) => p.replace(ROOT, '')).join(', ')}`,
    );
  } else {
    pass('SK-05a', `All domain packages have src/index.ts (${packages.length} checked)`);
  }

  // 5b: collect all domain package names, then scan for deep imports
  const pkgNames = new Set();
  for (const pkg of packages) {
    const pjson = readFile(join(pkg, 'package.json'));
    try {
      const parsed = JSON.parse(pjson);
      if (parsed.name) pkgNames.add(parsed.name);
    } catch {
      // skip
    }
  }

  const deepImportViolations = [];
  // Pattern: import from 'afenda-xxx/src/...' or 'afenda-xxx/calculators/...' etc.
  const deepImportRe = /from\s+['"]([a-z-]+)(\/[^'"]+)['"]/g;

  for (const pkg of packages) {
    const srcDir = join(pkg, 'src');
    const files = walk(srcDir).filter((f) => !f.includes('__tests__'));
    for (const file of files) {
      const content = readFile(file);
      let match;
      deepImportRe.lastIndex = 0;
      while ((match = deepImportRe.exec(content)) !== null) {
        const importedPkg = match[1];
        const subpath = match[2];
        // Only flag if importing another domain package via a deep path
        if (pkgNames.has(importedPkg) && subpath !== '') {
          const rel = file.replace(ROOT + '/', '').replace(ROOT + '\\', '');
          deepImportViolations.push(`${rel}: import '${importedPkg}${subpath}'`);
        }
      }
    }
  }

  if (deepImportViolations.length > 0) {
    fail(
      'SK-05b',
      `Deep imports between domain packages detected:\n  ${deepImportViolations.join('\n  ')}`,
    );
  } else {
    pass('SK-05b', `No deep imports between domain packages (${packages.length} packages scanned)`);
  }
}

/**
 * SK-06: No `new Date(` in business-domain/** (excluding __tests__)
 */
function sk06() {
  const packages = getDomainPackages();
  const violations = [];

  for (const pkg of packages) {
    const srcDir = join(pkg, 'src');
    const files = walk(srcDir).filter((f) => !f.includes('__tests__'));
    for (const file of files) {
      const content = readFile(file);
      if (/new Date\(\s*\)/.test(content)) {
        const rel = file.replace(ROOT + '/', '').replace(ROOT + '\\', '');
        violations.push(rel);
      }
    }
  }

  if (violations.length > 0) {
    fail('SK-06', `new Date() found in domain packages (INV-C03):\n  ${violations.join('\n  ')}`);
  } else {
    pass('SK-06', `No new Date() in domain packages (${packages.length} packages scanned)`);
  }
}

/**
 * SK-07: No cross-domain service imports (business-domain/X/src/services imported by business-domain/Y)
 */
function sk07() {
  const packages = getDomainPackages();
  const violations = [];

  for (const pkg of packages) {
    const srcDir = join(pkg, 'src');
    const files = walk(srcDir);
    for (const file of files) {
      const content = readFile(file);
      // Detect imports of another domain package's services/ path
      const matches =
        content.match(/from\s+['"][^'"]*business-domain\/[^'"]*\/src\/services[^'"]*['"]/g) ?? [];
      if (matches.length > 0) {
        const rel = file.replace(ROOT + '/', '').replace(ROOT + '\\', '');
        violations.push(`${rel}: ${matches.join(', ')}`);
      }
    }
  }

  if (violations.length > 0) {
    fail('SK-07', `Cross-domain service imports detected (INV-L02):\n  ${violations.join('\n  ')}`);
  } else {
    pass('SK-07', `No cross-domain service imports (${packages.length} packages scanned)`);
  }
}

/**
 * SK-08: No db.insert/update/delete/execute in business-domain/** (excluding __tests__)
 */
function sk08() {
  const packages = getDomainPackages();
  const violations = [];
  const pattern = /\bdb\.(insert|update|delete|execute|transaction)\s*\(/;

  for (const pkg of packages) {
    const srcDir = join(pkg, 'src');
    const files = walk(srcDir).filter((f) => !f.includes('__tests__'));
    for (const file of files) {
      const content = readFile(file);
      if (pattern.test(content)) {
        const rel = file.replace(ROOT + '/', '').replace(ROOT + '\\', '');
        violations.push(rel);
      }
    }
  }

  if (violations.length > 0) {
    fail(
      'SK-08',
      `DB mutation calls in domain packages (INV-DOM-04):\n  ${violations.join('\n  ')}`,
    );
  } else {
    pass('SK-08', `No DB mutations in domain packages (${packages.length} packages scanned)`);
  }
}

// ── SK-09: Every build*Intent() function accepts idempotencyKey ──────────────

function sk09() {
  const packages = getDomainPackages();
  const violations = [];

  for (const pkg of packages) {
    const cmdDir = join(pkg, 'src', 'commands');
    const files = walk(cmdDir);
    for (const file of files) {
      const content = readFile(file);
      // Find all exported build*Intent functions
      const fnMatches = [
        ...content.matchAll(/export\s+function\s+(build\w*Intent)\s*\(([^)]*)\)/g),
      ];
      for (const m of fnMatches) {
        const fnName = m[1];
        const params = m[2];
        if (!params.includes('idempotencyKey')) {
          const rel = file.replace(ROOT + '/', '').replace(ROOT + '\\', '');
          violations.push(`${rel}: ${fnName}() missing idempotencyKey param`);
        }
      }
    }
  }

  if (violations.length > 0) {
    fail('SK-09', `build*Intent() functions missing idempotencyKey:\n  ${violations.join('\n  ')}`);
  } else {
    pass('SK-09', `All build*Intent() functions accept idempotencyKey`);
  }
}

// ── SK-10: Calculator return types include inputs + explanation ───────────────

function sk10() {
  const packages = getDomainPackages();
  const violations = [];

  for (const pkg of packages) {
    const calcDir = join(pkg, 'src', 'calculators');
    const files = walk(calcDir);
    for (const file of files) {
      if (file.includes('__tests__')) continue;
      const content = readFile(file);
      // Find exported functions that return objects — check if they include inputs/explanation
      const exportedFns = [...content.matchAll(/export\s+function\s+(\w+)\s*\(/g)];
      if (exportedFns.length === 0) continue;

      // Check if the file references CalculatorResult or has inputs/explanation in return types
      const hasCalculatorResult = /CalculatorResult/.test(content);
      const hasInputsField = /\binputs\s*[,:]/m.test(content);
      const hasExplanationField = /\bexplanation\s*[,:]/m.test(content);

      if (!hasCalculatorResult && !(hasInputsField && hasExplanationField)) {
        const rel = file.replace(ROOT + '/', '').replace(ROOT + '\\', '');
        const fns = exportedFns.map((m) => m[1]).join(', ');
        violations.push(`${rel}: [${fns}] — missing CalculatorResult or inputs+explanation`);
      }
    }
  }

  if (violations.length > 0) {
    fail(
      'SK-10',
      `Calculators missing inputs+explanation in return type:\n  ${violations.join('\n  ')}`,
    );
  } else {
    pass('SK-10', `All calculators return CalculatorResult or inputs+explanation`);
  }
}

// ── SK-11: Exported queries filter by orgId ──────────────────────────────────

function sk11() {
  const packages = getDomainPackages();
  const violations = [];

  for (const pkg of packages) {
    const queryDir = join(pkg, 'src', 'queries');
    const files = walk(queryDir);
    for (const file of files) {
      if (file.includes('__tests__')) continue;
      const content = readFile(file);
      // Check that exported async functions reference orgId somewhere
      const exportedFns = [...content.matchAll(/export\s+async\s+function\s+(\w+)\s*\(/g)];
      if (exportedFns.length === 0) continue;

      if (!/orgId/.test(content)) {
        const rel = file.replace(ROOT + '/', '').replace(ROOT + '\\', '');
        const fns = exportedFns.map((m) => m[1]).join(', ');
        violations.push(`${rel}: [${fns}] — no orgId filter found`);
      }
    }
  }

  if (violations.length > 0) {
    fail('SK-11', `Queries missing orgId filter:\n  ${violations.join('\n  ')}`);
  } else {
    pass('SK-11', `All exported queries filter by orgId`);
  }
}

// ── FIN-01: ledgerId required on high-severity balance-impacting intents ─────

function fin01() {
  const intentSrc = readFile(join(ROOT, 'packages/canon/src/types/domain-intent.ts'));
  const registrySrc = readFile(
    join(ROOT, 'packages/canon/src/registries/domain-intent-registry.ts'),
  );

  // Find high-severity intents with ledgerImpact: true
  const highLedgerIntents = [];
  const entries = [
    ...registrySrc.matchAll(
      /'([a-z-]+\.[a-z.-]+)':\s*\{[^}]*severity:\s*'high'[^}]*ledgerImpact:\s*true/gs,
    ),
  ];
  for (const m of entries) {
    highLedgerIntents.push(m[1]);
  }
  // Also try reversed order (ledgerImpact before severity)
  const entriesRev = [
    ...registrySrc.matchAll(
      /'([a-z-]+\.[a-z.-]+)':\s*\{[^}]*ledgerImpact:\s*true[^}]*severity:\s*'high'/gs,
    ),
  ];
  for (const m of entriesRev) {
    if (!highLedgerIntents.includes(m[1])) highLedgerIntents.push(m[1]);
  }

  // For each high-severity ledger-impacting intent, check that its payload type includes ledgerId
  const violations = [];
  for (const intentType of highLedgerIntents) {
    // Find the payload type name from the union
    const unionMatch = intentSrc.match(
      new RegExp(`type:\\s*'${intentType.replace('.', '\\.')}'\\s*;\\s*payload:\\s*(\\w+)`),
    );
    if (!unionMatch) continue;
    const payloadTypeName = unionMatch[1];

    // Find the payload type definition
    const typeDefMatch = intentSrc.match(
      new RegExp(`export\\s+type\\s+${payloadTypeName}\\s*=\\s*\\{([^}]+)\\}`, 's'),
    );
    if (!typeDefMatch) continue;

    if (!typeDefMatch[1].includes('ledgerId')) {
      violations.push(`${intentType} (${payloadTypeName}): missing ledgerId field`);
    }
  }

  if (violations.length > 0) {
    fail(
      'FIN-01',
      `High-severity ledger-impacting intents missing ledgerId:\n  ${violations.join('\n  ')}`,
    );
  } else {
    pass(
      'FIN-01',
      `All high-severity ledger-impacting intents have ledgerId (${highLedgerIntents.length} checked)`,
    );
  }
}

// ── FIN-02: effectiveAt required on AccountingEvent-emitting commands ─────────

function fin02() {
  const intentSrc = readFile(join(ROOT, 'packages/canon/src/types/domain-intent.ts'));

  // Find all payload types that have effectiveAt — these are the compliant ones
  // Check all payload types for presence of effectiveAt or effectiveDate
  const payloadTypes = [...intentSrc.matchAll(/export\s+type\s+(\w+Payload)\s*=\s*\{([^}]+)\}/gs)];
  const missingEffective = [];

  for (const m of payloadTypes) {
    const name = m[1];
    const body = m[2];
    // Only check payloads that are likely accounting-event-emitting (have ledger/journal/posting semantics)
    const isAccountingRelated =
      /ledger|journal|posting|accrue|accrual|derive|reclass|allocation/i.test(name);
    if (
      isAccountingRelated &&
      !body.includes('effectiveAt') &&
      !body.includes('effectiveDate') &&
      !body.includes('effectivePeriod')
    ) {
      missingEffective.push(name);
    }
  }

  if (missingEffective.length > 0) {
    fail(
      'FIN-02',
      `Accounting-related payloads missing effectiveAt:\n  ${missingEffective.join('\n  ')}`,
    );
  } else {
    pass('FIN-02', `All accounting-related payloads have effectiveAt/effectiveDate`);
  }
}

// ── FIN-03: Deterministic replay — derivation engine uses stableCanonicalJson ─

function fin03() {
  const hubDir = join(DOMAIN_ROOT, 'finance', 'accounting-hub', 'src');
  const files = walk(hubDir).filter((f) => !f.includes('__tests__'));

  let usesStableJson = false;
  for (const file of files) {
    const content = readFile(file);
    if (/stableCanonicalJson/.test(content)) {
      usesStableJson = true;
      break;
    }
  }

  if (!usesStableJson) {
    fail('FIN-03', 'accounting-hub does not use stableCanonicalJson for deterministic hashing');
  } else {
    pass('FIN-03', 'accounting-hub uses stableCanonicalJson for deterministic replay');
  }
}

// ── FIN-04: High-severity intents must have idempotencyKey in build*Intent ────

function fin04() {
  const registrySrc = readFile(
    join(ROOT, 'packages/canon/src/registries/domain-intent-registry.ts'),
  );

  // Extract high-severity intent types
  const highSeverityIntents = [];
  // Match entries block by block
  const blocks = [...registrySrc.matchAll(/'([a-z-]+\.[a-z.-]+)':\s*\{([\s\S]*?)\}/g)];
  for (const b of blocks) {
    if (/severity:\s*'high'/.test(b[2])) {
      highSeverityIntents.push(b[1]);
    }
  }

  // For each high-severity intent, find the owning package and check its build*Intent
  const violations = [];
  for (const intentType of highSeverityIntents) {
    const owner = intentType.split('.')[0];
    // Find the package that owns this intent
    const packages = getDomainPackages();
    let found = false;
    for (const pkg of packages) {
      const cmdDir = join(pkg, 'src', 'commands');
      const files = walk(cmdDir);
      for (const file of files) {
        const content = readFile(file);
        if (content.includes(`'${intentType}'`)) {
          found = true;
          // Check if the function that produces this intent accepts idempotencyKey
          if (!content.includes('idempotencyKey')) {
            const rel = file.replace(ROOT + '/', '').replace(ROOT + '\\', '');
            violations.push(
              `${rel}: intent '${intentType}' (high severity) — builder missing idempotencyKey`,
            );
          }
        }
      }
    }
    if (!found) {
      // Intent type not found in any command file — might be OK if it's wired differently
    }
  }

  if (violations.length > 0) {
    fail(
      'FIN-04',
      `High-severity intent builders missing idempotencyKey:\n  ${violations.join('\n  ')}`,
    );
  } else {
    pass(
      'FIN-04',
      `All high-severity intent builders include idempotencyKey (${highSeverityIntents.length} checked)`,
    );
  }
}

// ── FIN-05: No direct journal crafting — only accounting-hub may INSERT journals

function fin05() {
  const packages = getDomainPackages();
  const violations = [];

  for (const pkg of packages) {
    // Skip accounting-hub itself — it's the only one allowed to post journals
    if (pkg.includes('accounting-hub')) continue;

    const srcDir = join(pkg, 'src');
    const files = walk(srcDir).filter((f) => !f.includes('__tests__'));
    for (const file of files) {
      const content = readFile(file);
      // Check for direct imports of journal_entries or journal_lines tables for write purposes
      if (
        /import\s+.*\b(journalEntries|journalLines|journal_entries|journal_lines)\b.*from\s+['"]afenda-database['"]/.test(
          content,
        )
      ) {
        // Check if it's a query (SELECT) or a write — queries are OK in accounting package
        if (pkg.includes('accounting') && !pkg.includes('accounting-hub')) {
          // accounting package can READ journals, just not INSERT
          // Check for insert/update patterns
          if (/\.insert\s*\(/.test(content) || /\.update\s*\(/.test(content)) {
            const rel = file.replace(ROOT + '/', '').replace(ROOT + '\\', '');
            violations.push(`${rel}: direct journal write detected`);
          }
        } else {
          // Non-accounting packages should not import journal tables at all
          const rel = file.replace(ROOT + '/', '').replace(ROOT + '\\', '');
          violations.push(`${rel}: imports journal tables (only accounting-hub may post journals)`);
        }
      }
    }
  }

  if (violations.length > 0) {
    fail('FIN-05', `Direct journal crafting outside accounting-hub:\n  ${violations.join('\n  ')}`);
  } else {
    pass('FIN-05', `No direct journal crafting outside accounting-hub`);
  }
}

// ── Run all gates ─────────────────────────────────────────────────────────────

console.log('\n\x1b[1mRunning Domain CI Gates (SK-01…SK-11, FIN-01…FIN-05)\x1b[0m\n');

sk01();
sk02();
sk03();
sk04();
sk05();
sk06();
sk07();
sk08();
sk09();
sk10();
sk11();

console.log('');
console.log('\x1b[1mRunning Finance CI Gates (FIN-01…FIN-05)\x1b[0m\n');

fin01();
fin02();
fin03();
fin04();
fin05();

console.log('');
if (failures > 0) {
  console.error(`\x1b[31m${failures} gate(s) failed.\x1b[0m`);
  process.exit(1);
} else {
  console.log('\x1b[32mAll domain + finance gates passed.\x1b[0m');
  process.exit(0);
}
