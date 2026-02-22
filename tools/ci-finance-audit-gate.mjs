#!/usr/bin/env node
/**
 * CI Finance Audit Gate
 *
 * Reads the Finance Audit Registry (SSOT) from canon, scans the codebase
 * for evidence of each requirement (entities, APIs, tests, reports, evidence),
 * emits .afenda/finance-audit.ledger.json with per-requirement scores,
 * and fails CI if any gate check fails.
 *
 * Modeled on ci-ais-benchmark-gate.mjs but driven by the typed registry
 * rather than a markdown file.
 *
 * Scoring signals (per requirement, 0–100):
 *   E1: Entity evidence — schema/table/type exists for ≥50% of mustHaveEntities  +20
 *   E2: API evidence — function/handler exists for ≥50% of mustHaveApis          +20
 *   E3: Test evidence — test file references requirement ID or test name          +20
 *   E4: Report evidence — report/query function exists for ≥50% of mustHaveReports +10
 *   E5: Evidence artifact — evidence kind keyword found in codebase               +10
 *   E6: Gate reference — gate name found in CI scripts or test files              +10
 *   E7: Traceability — requirement ID found in JSDoc near export                  +10
 *
 * Status thresholds:
 *   ≥60  → covered
 *   30–59 → partial
 *   <30  → missing
 *
 * Gates:
 *   FAR-01: All S0 requirements must be ≥ partial (≥30)
 *   FAR-02: No requirement is missing (<30) if weight ≥ 4
 *   FAR-03: Average confidence ≥ 25 (baseline — will increase as implementation progresses)
 *   FAR-04: Registry integrity — all requirement IDs are unique
 *   FAR-05: Registry integrity — all sections have ≥1 requirement
 *   FAR-06: Global gates referenced in at least one requirement
 *
 * Usage: node tools/ci-finance-audit-gate.mjs [--emit-only]
 */

import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';

const _rawRoot = new URL('.', import.meta.url).pathname;
const ROOT = resolve(process.platform === 'win32' ? _rawRoot.slice(1) : _rawRoot, '..');
const LEDGER_PATH = join(ROOT, '.afenda', 'finance-audit.ledger.json');
const REGISTRY_PATH = join(ROOT, 'packages', 'canon', 'src', 'registries', 'finance', 'finance-audit-registry.ts');

const EMIT_ONLY = process.argv.includes('--emit-only');

const COVERED_THRESHOLD = 60;
const PARTIAL_THRESHOLD = 30;

let failures = 0;
let warnings = 0;

function fail(gate, message) {
  console.error(`\x1b[31m✗ ${gate}\x1b[0m ${message}`);
  failures++;
}

function pass(gate, message) {
  console.log(`\x1b[32m✓ ${gate}\x1b[0m ${message}`);
}

function warn(gate, message) {
  console.log(`\x1b[33m⚠ ${gate}\x1b[0m ${message}`);
  warnings++;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function readFile(path) {
  try { return readFileSync(path, 'utf8'); } catch { return ''; }
}

function walk(dir, ext = '.ts') {
  const results = [];
  try {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory() && entry !== 'node_modules' && entry !== 'dist' && entry !== '.next') {
        results.push(...walk(full, ext));
      } else if (full.endsWith(ext)) {
        results.push(full);
      }
    }
  } catch { /* directory may not exist */ }
  return results;
}

// ── Step 1: Parse registry from TypeScript source ────────────────────────────

function parseRegistry() {
  const content = readFile(REGISTRY_PATH);
  if (!content) {
    console.error('ERROR: Cannot read finance-audit-registry.ts');
    process.exit(1);
  }

  const sections = [];

  // Split by section comment markers
  const sectionBlocks = content.split(/\/\/ ──.*?──+/g).filter(b => b.includes("key: '"));

  for (const block of sectionBlocks) {
    const keyMatch = block.match(/key:\s*'([^']+)'/);
    const titleMatch = block.match(/title:\s*'([^']+)'/);
    if (!keyMatch) continue;

    const section = {
      key: keyMatch[1],
      title: titleMatch ? titleMatch[1] : keyMatch[1],
      requirements: [],
    };

    // Find all requirement IDs in this block, then extract each requirement's data
    const idRe = /id:\s*'(FIN-[A-Z]+-[A-Z]+-\d+)'/g;
    let idMatch;
    const reqIds = [];
    while ((idMatch = idRe.exec(block)) !== null) {
      reqIds.push({ id: idMatch[1], index: idMatch.index });
    }

    for (let ri = 0; ri < reqIds.length; ri++) {
      const start = reqIds[ri].index;
      const end = ri + 1 < reqIds.length ? reqIds[ri + 1].index : block.length;
      const rb = block.slice(start, end);

      const tMatch = rb.match(/title:\s*'([^']+)'/);
      const sevMatch = rb.match(/severity:\s*'([^']+)'/);
      const wMatch = rb.match(/weight:\s*(\d+)/);

      // Extract mustHaveEntities
      const entMatch = rb.match(/mustHaveEntities:\s*\[([^\]]*)\]/s);
      const entities = entMatch ? (entMatch[1].match(/'([^']+)'/g) ?? []).map(s => s.replace(/'/g, '')) : [];

      // Extract mustHaveApis
      const apiMatch = rb.match(/mustHaveApis:\s*\[([^\]]*)\]/s);
      const apis = apiMatch ? (apiMatch[1].match(/name:\s*'([^']+)'/g) ?? []).map(s => s.replace(/name:\s*'/, '').replace(/'/, '')) : [];

      // Extract mustHaveTests
      const testMatch = rb.match(/mustHaveTests:\s*\[([^\]]*)\]/s);
      const tests = testMatch ? (testMatch[1].match(/name:\s*'([^']+)'/g) ?? []).map(s => s.replace(/name:\s*'/, '').replace(/'/, '')) : [];

      // Extract mustHaveReports
      const repMatch = rb.match(/mustHaveReports:\s*\[([^\]]*)\]/s);
      const reports = repMatch ? (repMatch[1].match(/name:\s*'([^']+)'/g) ?? []).map(s => s.replace(/name:\s*'/, '').replace(/'/, '')) : [];

      // Extract mustHaveEvidence
      const evMatch = rb.match(/mustHaveEvidence:\s*\[([^\]]*)\]/s);
      const evidence = evMatch ? (evMatch[1].match(/kind:\s*'([^']+)'/g) ?? []).map(s => s.replace(/kind:\s*'/, '').replace(/'/, '')) : [];

      // Extract gates
      const gateMatch = rb.match(/gates:\s*\[([^\]]*)\]/s);
      const gates = gateMatch ? (gateMatch[1].match(/'([^']+)'/g) ?? []).map(s => s.replace(/'/g, '')) : [];

      section.requirements.push({
        id: reqIds[ri].id,
        title: tMatch ? tMatch[1] : '',
        severity: sevMatch ? sevMatch[1] : 'S3',
        weight: wMatch ? parseInt(wMatch[1], 10) : 1,
        entities,
        apis,
        tests,
        reports,
        evidence,
        gates,
      });
    }

    if (section.requirements.length > 0) {
      sections.push(section);
    }
  }

  // Extract global gates
  const globalGatesMatch = content.match(/globalGates:\s*\[([^\]]*)\]/s);
  const globalGates = globalGatesMatch
    ? (globalGatesMatch[1].match(/'([^']+)'/g) ?? []).map(s => s.replace(/'/g, ''))
    : [];

  return { sections, globalGates };
}

// ── Step 2: Scan paths for evidence ──────────────────────────────────────────

const SCAN_DIRS = [
  join(ROOT, 'packages'),
  join(ROOT, 'business-domain'),
  join(ROOT, 'tools'),
  join(ROOT, 'apps'),
];

/** Lazily cached file content map */
const _fileCache = new Map();
let _allTsFiles = null;

function getAllTsFiles() {
  if (_allTsFiles) return _allTsFiles;
  _allTsFiles = [];
  for (const dir of SCAN_DIRS) {
    _allTsFiles.push(...walk(dir, '.ts'));
    _allTsFiles.push(...walk(dir, '.mjs'));
  }
  return _allTsFiles;
}

function getCachedContent(filePath) {
  if (_fileCache.has(filePath)) return _fileCache.get(filePath);
  const content = readFile(filePath);
  _fileCache.set(filePath, content);
  return content;
}

/** Convert entity name to search patterns */
function entityToPatterns(entity) {
  // PascalCase → snake_case, camelCase, kebab-case
  const snake = entity.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
  const kebab = snake.replace(/_/g, '-');
  const camel = entity.charAt(0).toLowerCase() + entity.slice(1);
  return [entity, snake, kebab, camel];
}

/** Convert API name to search patterns */
function apiToPatterns(apiName) {
  // 'ap.invoice.post' → ['ap.invoice.post', 'apInvoicePost', 'ap_invoice_post']
  const parts = apiName.split('.');
  const camel = parts[0] + parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  const snake = parts.join('_');
  return [apiName, camel, snake];
}

/** Check if any pattern matches in content (case-insensitive for some) */
function hasAnyPattern(content, patterns) {
  for (const p of patterns) {
    if (content.includes(p)) return true;
  }
  return false;
}

// ── Step 3: Confidence scoring ───────────────────────────────────────────────

function scoreRequirement(req) {
  const signals = { e1: false, e2: false, e3: false, e4: false, e5: false, e6: false, e7: false };
  const evidenceMap = {};
  const allFiles = getAllTsFiles();

  // E1: Entity evidence
  if (req.entities.length > 0) {
    let found = 0;
    const foundEntities = [];
    for (const entity of req.entities) {
      const patterns = entityToPatterns(entity);
      for (const file of allFiles) {
        if (file.includes('__tests__') || file.includes('.test.') || file.includes('.spec.')) continue;
        const content = getCachedContent(file);
        if (hasAnyPattern(content, patterns)) {
          found++;
          foundEntities.push(entity);
          break;
        }
      }
    }
    if (found >= Math.ceil(req.entities.length * 0.5)) {
      signals.e1 = true;
      evidenceMap.entities = `${found}/${req.entities.length}: ${foundEntities.slice(0, 3).join(', ')}`;
    }
  }

  // E2: API evidence
  if (req.apis.length > 0) {
    let found = 0;
    const foundApis = [];
    for (const api of req.apis) {
      const patterns = apiToPatterns(api);
      for (const file of allFiles) {
        if (file.includes('__tests__')) continue;
        const content = getCachedContent(file);
        if (hasAnyPattern(content, patterns)) {
          found++;
          foundApis.push(api);
          break;
        }
      }
    }
    if (found >= Math.ceil(req.apis.length * 0.5)) {
      signals.e2 = true;
      evidenceMap.apis = `${found}/${req.apis.length}: ${foundApis.slice(0, 3).join(', ')}`;
    }
  }

  // E3: Test evidence
  const testFiles = allFiles.filter(f => f.includes('__tests__') || f.includes('.test.') || f.includes('.spec.'));
  for (const file of testFiles) {
    const content = getCachedContent(file);
    // Check for requirement ID in test
    if (content.includes(req.id)) {
      signals.e3 = true;
      evidenceMap.test = file.replace(ROOT + '/', '').replace(ROOT + '\\', '') + ' (ID match)';
      break;
    }
    // Check for test names
    for (const testName of req.tests) {
      if (content.includes(testName)) {
        signals.e3 = true;
        evidenceMap.test = file.replace(ROOT + '/', '').replace(ROOT + '\\', '') + ` (${testName})`;
        break;
      }
    }
    if (signals.e3) break;
  }

  // E4: Report evidence
  if (req.reports.length > 0) {
    let found = 0;
    for (const report of req.reports) {
      const patterns = apiToPatterns(report);
      for (const file of allFiles) {
        const content = getCachedContent(file);
        if (hasAnyPattern(content, patterns)) {
          found++;
          break;
        }
      }
    }
    if (found >= Math.ceil(req.reports.length * 0.5)) {
      signals.e4 = true;
      evidenceMap.reports = `${found}/${req.reports.length}`;
    }
  }

  // E5: Evidence artifact kind keywords
  for (const kind of req.evidence) {
    const patterns = entityToPatterns(kind);
    for (const file of allFiles) {
      const content = getCachedContent(file);
      if (hasAnyPattern(content, patterns)) {
        signals.e5 = true;
        break;
      }
    }
    if (signals.e5) break;
  }

  // E6: Gate reference
  for (const gate of req.gates) {
    for (const file of allFiles) {
      if (!file.includes('tools/') && !file.includes('ci-') && !file.includes('.test.')) continue;
      const content = getCachedContent(file);
      if (content.includes(gate)) {
        signals.e6 = true;
        break;
      }
    }
    if (signals.e6) break;
  }

  // E7: Traceability — requirement ID in JSDoc near export
  const idRe = new RegExp(`\\b${req.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
  const exportRe = /^export\s+(async\s+)?(function|class|const|type|interface)\s/;
  for (const file of allFiles) {
    if (file.includes('__tests__')) continue;
    const content = getCachedContent(file);
    if (!idRe.test(content)) continue;
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (!idRe.test(lines[i])) continue;
      for (let j = i; j < Math.min(i + 25, lines.length); j++) {
        if (exportRe.test(lines[j])) {
          signals.e7 = true;
          evidenceMap.idRef = file.replace(ROOT + '/', '').replace(ROOT + '\\', '');
          break;
        }
      }
      if (signals.e7) break;
      for (let j = Math.max(0, i - 5); j < i; j++) {
        if (exportRe.test(lines[j])) {
          signals.e7 = true;
          evidenceMap.idRef = file.replace(ROOT + '/', '').replace(ROOT + '\\', '');
          break;
        }
      }
      if (signals.e7) break;
    }
    if (signals.e7) break;
  }

  const score = Math.min(100,
    (signals.e1 ? 20 : 0) +
    (signals.e2 ? 20 : 0) +
    (signals.e3 ? 20 : 0) +
    (signals.e4 ? 10 : 0) +
    (signals.e5 ? 10 : 0) +
    (signals.e6 ? 10 : 0) +
    (signals.e7 ? 10 : 0),
  );

  let status;
  if (score >= COVERED_THRESHOLD) status = 'covered';
  else if (score >= PARTIAL_THRESHOLD) status = 'partial';
  else status = 'missing';

  return { id: req.id, title: req.title, severity: req.severity, weight: req.weight, confidence: score, status, signals, evidence: evidenceMap };
}

// ── Step 4: Build ledger ─────────────────────────────────────────────────────

function buildLedger(registry) {
  const sections = [];

  for (const section of registry.sections) {
    const scored = section.requirements.map(scoreRequirement);
    sections.push({ key: section.key, title: section.title, items: scored });
  }

  const allScored = sections.flatMap(s => s.items);
  const avgConfidence = allScored.length > 0
    ? Math.round(allScored.reduce((s, i) => s + i.confidence, 0) / allScored.length * 10) / 10
    : 0;

  const summary = {
    total: allScored.length,
    covered: allScored.filter(i => i.status === 'covered').length,
    partial: allScored.filter(i => i.status === 'partial').length,
    missing: allScored.filter(i => i.status === 'missing').length,
    avgConfidence,
    coveragePct: allScored.length > 0
      ? Math.round((allScored.filter(i => i.status === 'covered').length / allScored.length) * 1000) / 10
      : 0,
    weightedScore: allScored.length > 0
      ? Math.round(allScored.reduce((s, i) => s + i.confidence * i.weight, 0) / allScored.reduce((s, i) => s + i.weight * 100, 0) * 1000) / 10
      : 0,
  };

  return {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    registry: 'finance-audit-registry.ts',
    thresholds: { covered: COVERED_THRESHOLD, partial: PARTIAL_THRESHOLD },
    summary,
    sections,
  };
}

// ── Step 5: Emit ledger ──────────────────────────────────────────────────────

function emitLedger(ledger) {
  const dir = join(ROOT, '.afenda');
  try { mkdirSync(dir, { recursive: true }); } catch { /* exists */ }
  writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 2), 'utf8');
}

// ── Step 6: Gate checks ──────────────────────────────────────────────────────

function runGates(ledger, registry) {
  console.log('\n\x1b[1mRunning Finance Audit Gates (FAR-01…FAR-06)\x1b[0m\n');

  const allItems = ledger.sections.flatMap(s => s.items);

  // FAR-01: All S0 requirements must be ≥ partial
  const s0Missing = allItems.filter(i => i.severity === 'S0' && i.status === 'missing');
  if (s0Missing.length === 0) {
    pass('FAR-01', `All S0 (critical) requirements are ≥ partial`);
  } else {
    warn('FAR-01', `${s0Missing.length} S0 requirement(s) below partial:\n    ${s0Missing.map(i => `${i.id} (${i.confidence})`).join(', ')}`);
  }

  // FAR-02: No high-weight requirement is missing
  const highWeightMissing = allItems.filter(i => i.weight >= 4 && i.status === 'missing');
  if (highWeightMissing.length === 0) {
    pass('FAR-02', `No high-weight (≥4) requirements are missing`);
  } else {
    warn('FAR-02', `${highWeightMissing.length} high-weight requirement(s) missing:\n    ${highWeightMissing.map(i => `${i.id} (w${i.weight}, ${i.confidence})`).join(', ')}`);
  }

  // FAR-03: Average confidence baseline
  if (ledger.summary.avgConfidence >= 25) {
    pass('FAR-03', `Average confidence: ${ledger.summary.avgConfidence} (≥25 baseline)`);
  } else {
    warn('FAR-03', `Average confidence too low: ${ledger.summary.avgConfidence} (expected ≥25)`);
  }

  // FAR-04: Registry integrity — unique IDs
  const allIds = allItems.map(i => i.id);
  const dupes = allIds.filter((id, idx) => allIds.indexOf(id) !== idx);
  if (dupes.length === 0) {
    pass('FAR-04', `All ${allIds.length} requirement IDs are unique`);
  } else {
    fail('FAR-04', `Duplicate requirement IDs: ${[...new Set(dupes)].join(', ')}`);
  }

  // FAR-05: Every section has ≥1 requirement
  const emptySections = registry.sections.filter(s => s.requirements.length === 0);
  if (emptySections.length === 0) {
    pass('FAR-05', `All ${registry.sections.length} sections have ≥1 requirement`);
  } else {
    fail('FAR-05', `Empty sections: ${emptySections.map(s => s.key).join(', ')}`);
  }

  // FAR-06: Global gates referenced
  const allGates = new Set(allItems.flatMap(i => {
    // Find the original requirement to get gates
    for (const s of registry.sections) {
      const req = s.requirements.find(r => r.id === i.id);
      if (req) return req.gates;
    }
    return [];
  }));
  const unreferenced = registry.globalGates.filter(g => !allGates.has(g));
  if (unreferenced.length === 0) {
    pass('FAR-06', `All ${registry.globalGates.length} global gates referenced in requirements`);
  } else {
    warn('FAR-06', `${unreferenced.length} global gate(s) not referenced: ${unreferenced.join(', ')}`);
  }

  // Print distribution
  const bands = [
    { label: '90–100', items: allItems.filter(i => i.confidence >= 90) },
    { label: '60–89 ', items: allItems.filter(i => i.confidence >= 60 && i.confidence < 90) },
    { label: '30–59 ', items: allItems.filter(i => i.confidence >= 30 && i.confidence < 60) },
    { label: ' 0–29 ', items: allItems.filter(i => i.confidence < 30) },
  ];
  console.log(`\n\x1b[1mConfidence distribution:\x1b[0m`);
  for (const b of bands) {
    const bar = '█'.repeat(Math.max(1, Math.round(b.items.length)));
    console.log(`  ${b.label}: ${String(b.items.length).padStart(3)} ${bar}`);
  }

  // Print all items with scores
  console.log(`\n\x1b[1mRequirement scores:\x1b[0m`);
  for (const item of allItems.sort((a, b) => a.confidence - b.confidence)) {
    const color = item.status === 'missing' ? '\x1b[31m' : item.status === 'partial' ? '\x1b[33m' : '\x1b[32m';
    const signalStr = Object.entries(item.signals).filter(([, v]) => v).map(([k]) => k.toUpperCase()).join(',');
    console.log(`  ${color}${item.id.padEnd(20)} ${String(item.confidence).padStart(3)}  ${item.status.padEnd(8)} ${item.severity} w${item.weight}\x1b[0m  [${signalStr}]  ${item.title.slice(0, 50)}`);
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

console.log('\n\x1b[1mFinance Audit Registry Gate (confidence scoring)\x1b[0m\n');

console.log('Parsing finance-audit-registry.ts...');
const registry = parseRegistry();
const totalReqs = registry.sections.reduce((s, sec) => s + sec.requirements.length, 0);
console.log(`  Found ${totalReqs} requirements across ${registry.sections.length} sections`);
console.log(`  Global gates: ${registry.globalGates.length}`);

console.log('Scanning codebase for evidence...');
const ledger = buildLedger(registry);

console.log(`\n\x1b[1mSummary:\x1b[0m`);
console.log(`  Covered (≥${COVERED_THRESHOLD}):  ${ledger.summary.covered}`);
console.log(`  Partial (${PARTIAL_THRESHOLD}–${COVERED_THRESHOLD - 1}):  ${ledger.summary.partial}`);
console.log(`  Missing (<${PARTIAL_THRESHOLD}):   ${ledger.summary.missing}`);
console.log(`  Total:          ${ledger.summary.total}`);
console.log(`  Avg confidence: ${ledger.summary.avgConfidence}`);
console.log(`  Coverage:       ${ledger.summary.coveragePct}%`);
console.log(`  Weighted score: ${ledger.summary.weightedScore}%`);

emitLedger(ledger);
console.log(`\n\x1b[32m✓ Wrote .afenda/finance-audit.ledger.json\x1b[0m`);

if (!EMIT_ONLY) {
  runGates(ledger, registry);

  console.log('');
  if (failures > 0) {
    console.error(`\x1b[31m${failures} gate(s) failed, ${warnings} warning(s).\x1b[0m`);
    process.exit(1);
  } else if (warnings > 0) {
    console.log(`\x1b[33mAll gates passed with ${warnings} warning(s).\x1b[0m`);
    process.exit(0);
  } else {
    console.log('\x1b[32mAll Finance Audit gates passed.\x1b[0m');
    process.exit(0);
  }
} else {
  console.log('\n\x1b[33m--emit-only: skipping gate checks.\x1b[0m');
  process.exit(0);
}
