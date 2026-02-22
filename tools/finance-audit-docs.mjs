#!/usr/bin/env node
/**
 * Finance Audit Documentation Generator
 *
 * Reads the finance-audit.ledger.json and generates:
 *   1. .afenda/FINANCE-AUDIT-SCORECARD.md — Human-readable scorecard
 *   2. .afenda/finance-audit-dashboard.json — Machine-readable dashboard data
 *
 * Usage: node tools/finance-audit-docs.mjs
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';

const _rawRoot = new URL('.', import.meta.url).pathname;
const ROOT = resolve(process.platform === 'win32' ? _rawRoot.slice(1) : _rawRoot, '..');
const LEDGER_PATH = join(ROOT, '.afenda', 'finance-audit.ledger.json');
const SCORECARD_PATH = join(ROOT, '.afenda', 'FINANCE-AUDIT-SCORECARD.md');
const DASHBOARD_PATH = join(ROOT, '.afenda', 'finance-audit-dashboard.json');

function readFile(path) {
  try { return readFileSync(path, 'utf8'); } catch { return ''; }
}

function loadLedger() {
  const content = readFile(LEDGER_PATH);
  if (!content) {
    console.error('ERROR: finance-audit.ledger.json not found. Run ci:finance-audit first.');
    process.exit(1);
  }
  return JSON.parse(content);
}

// ── Scorecard Markdown ───────────────────────────────────────────────────────

function severityBadge(sev) {
  switch (sev) {
    case 'S0': return '🔴 S0';
    case 'S1': return '🟠 S1';
    case 'S2': return '🟡 S2';
    case 'S3': return '⚪ S3';
    default: return sev;
  }
}

function statusBadge(status) {
  switch (status) {
    case 'covered': return '✅ Covered';
    case 'partial': return '🟡 Partial';
    case 'missing': return '❌ Missing';
    default: return status;
  }
}

function signalList(signals) {
  return Object.entries(signals)
    .filter(([, v]) => v)
    .map(([k]) => k.toUpperCase())
    .join(', ') || '—';
}

function generateScorecard(ledger) {
  const lines = [];
  const ts = new Date(ledger.generatedAt).toISOString().replace('T', ' ').slice(0, 19);

  lines.push('# Finance Audit Readiness Scorecard');
  lines.push('');
  lines.push(`> Generated: ${ts} UTC | Registry: \`${ledger.registry}\` | Version: ${ledger.version}`);
  lines.push('');

  // Summary table
  lines.push('## Summary');
  lines.push('');
  lines.push('| Metric | Value |');
  lines.push('|--------|-------|');
  lines.push(`| **Total Requirements** | ${ledger.summary.total} |`);
  lines.push(`| **Covered (≥${ledger.thresholds.covered})** | ${ledger.summary.covered} |`);
  lines.push(`| **Partial (${ledger.thresholds.partial}–${ledger.thresholds.covered - 1})** | ${ledger.summary.partial} |`);
  lines.push(`| **Missing (<${ledger.thresholds.partial})** | ${ledger.summary.missing} |`);
  lines.push(`| **Average Confidence** | ${ledger.summary.avgConfidence} |`);
  lines.push(`| **Coverage %** | ${ledger.summary.coveragePct}% |`);
  lines.push(`| **Weighted Score** | ${ledger.summary.weightedScore}% |`);
  lines.push('');

  // Signal legend
  lines.push('## Signal Legend');
  lines.push('');
  lines.push('| Signal | Description | Weight |');
  lines.push('|--------|-------------|--------|');
  lines.push('| E1 | Entity evidence (≥50% of mustHaveEntities found) | +20 |');
  lines.push('| E2 | API evidence (≥50% of mustHaveApis found) | +20 |');
  lines.push('| E3 | Test evidence (requirement ID or test name in test file) | +20 |');
  lines.push('| E4 | Report evidence (≥50% of mustHaveReports found) | +10 |');
  lines.push('| E5 | Evidence artifact kind keyword found | +10 |');
  lines.push('| E6 | Gate reference in CI scripts | +10 |');
  lines.push('| E7 | Traceability (requirement ID in JSDoc near export) | +10 |');
  lines.push('');

  // Per-section detail
  lines.push('## Requirements by Section');
  lines.push('');

  for (const section of ledger.sections) {
    const sectionAvg = section.items.length > 0
      ? Math.round(section.items.reduce((s, i) => s + i.confidence, 0) / section.items.length)
      : 0;

    lines.push(`### ${section.title}`);
    lines.push('');
    lines.push(`> Section: \`${section.key}\` | Items: ${section.items.length} | Avg: ${sectionAvg}`);
    lines.push('');
    lines.push('| ID | Title | Sev | W | Score | Status | Signals |');
    lines.push('|----|-------|-----|---|-------|--------|---------|');

    for (const item of section.items) {
      const title = item.title.length > 55 ? item.title.slice(0, 52) + '…' : item.title;
      lines.push(
        `| \`${item.id}\` | ${title} | ${severityBadge(item.severity)} | ${item.weight} | **${item.confidence}** | ${statusBadge(item.status)} | ${signalList(item.signals)} |`,
      );
    }
    lines.push('');
  }

  // Confidence distribution
  const allItems = ledger.sections.flatMap(s => s.items);
  lines.push('## Confidence Distribution');
  lines.push('');
  const bands = [
    { label: '90–100', items: allItems.filter(i => i.confidence >= 90) },
    { label: '60–89', items: allItems.filter(i => i.confidence >= 60 && i.confidence < 90) },
    { label: '30–59', items: allItems.filter(i => i.confidence >= 30 && i.confidence < 60) },
    { label: '0–29', items: allItems.filter(i => i.confidence < 30) },
  ];
  lines.push('| Band | Count | Bar |');
  lines.push('|------|-------|-----|');
  for (const b of bands) {
    const bar = '█'.repeat(Math.max(1, b.items.length));
    lines.push(`| ${b.label} | ${b.items.length} | ${bar} |`);
  }
  lines.push('');

  // Action items
  const actionItems = allItems.filter(i => i.status !== 'covered').sort((a, b) => {
    const sevOrder = { S0: 0, S1: 1, S2: 2, S3: 3 };
    return (sevOrder[a.severity] ?? 9) - (sevOrder[b.severity] ?? 9) || b.weight - a.weight;
  });

  if (actionItems.length > 0) {
    lines.push('## Action Items (Priority Order)');
    lines.push('');
    for (const item of actionItems) {
      const missing = Object.entries(item.signals).filter(([, v]) => !v).map(([k]) => k.toUpperCase());
      lines.push(`- **${item.id}** (${item.severity}, w${item.weight}, score ${item.confidence}) — Missing signals: ${missing.join(', ')}`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push(`*Auto-generated by \`finance-audit-docs.mjs\` — do not edit manually.*`);

  return lines.join('\n');
}

// ── Dashboard JSON ───────────────────────────────────────────────────────────

function generateDashboard(ledger) {
  const allItems = ledger.sections.flatMap(s => s.items);

  // Severity breakdown
  const bySeverity = {};
  for (const sev of ['S0', 'S1', 'S2', 'S3']) {
    const items = allItems.filter(i => i.severity === sev);
    bySeverity[sev] = {
      total: items.length,
      covered: items.filter(i => i.status === 'covered').length,
      partial: items.filter(i => i.status === 'partial').length,
      missing: items.filter(i => i.status === 'missing').length,
      avgConfidence: items.length > 0
        ? Math.round(items.reduce((s, i) => s + i.confidence, 0) / items.length * 10) / 10
        : 0,
    };
  }

  // Signal coverage
  const signalCoverage = {};
  for (const sig of ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7']) {
    signalCoverage[sig] = {
      fired: allItems.filter(i => i.signals[sig]).length,
      total: allItems.length,
      pct: Math.round(allItems.filter(i => i.signals[sig]).length / allItems.length * 1000) / 10,
    };
  }

  // Section scores
  const sectionScores = ledger.sections.map(s => ({
    key: s.key,
    title: s.title,
    itemCount: s.items.length,
    avgConfidence: s.items.length > 0
      ? Math.round(s.items.reduce((sum, i) => sum + i.confidence, 0) / s.items.length * 10) / 10
      : 0,
    covered: s.items.filter(i => i.status === 'covered').length,
    partial: s.items.filter(i => i.status === 'partial').length,
    missing: s.items.filter(i => i.status === 'missing').length,
  }));

  // Top risks (lowest confidence, highest severity/weight)
  const topRisks = [...allItems]
    .sort((a, b) => a.confidence - b.confidence || b.weight - a.weight)
    .slice(0, 10)
    .map(i => ({ id: i.id, title: i.title, severity: i.severity, weight: i.weight, confidence: i.confidence, status: i.status }));

  return {
    dashboardVersion: '1.0',
    generatedAt: new Date().toISOString(),
    ledgerVersion: ledger.version,
    summary: ledger.summary,
    bySeverity,
    signalCoverage,
    sectionScores,
    topRisks,
  };
}

// ── Main ─────────────────────────────────────────────────────────────────────

console.log('\n\x1b[1mFinance Audit Documentation Generator\x1b[0m\n');

const ledger = loadLedger();
console.log(`  Ledger: v${ledger.version}, ${ledger.summary.total} requirements`);

// Generate scorecard
const scorecard = generateScorecard(ledger);
mkdirSync(join(ROOT, '.afenda'), { recursive: true });
writeFileSync(SCORECARD_PATH, scorecard, 'utf8');
console.log(`\x1b[32m✓ Wrote ${SCORECARD_PATH.replace(ROOT + '/', '').replace(ROOT + '\\', '')}\x1b[0m`);

// Generate dashboard
const dashboard = generateDashboard(ledger);
writeFileSync(DASHBOARD_PATH, JSON.stringify(dashboard, null, 2), 'utf8');
console.log(`\x1b[32m✓ Wrote ${DASHBOARD_PATH.replace(ROOT + '/', '').replace(ROOT + '\\', '')}\x1b[0m`);

// Print quick summary
console.log(`\n  Scorecard: ${scorecard.split('\n').length} lines`);
console.log(`  Dashboard: ${Object.keys(dashboard.signalCoverage).length} signals tracked`);
console.log(`  Top risk: ${dashboard.topRisks[0]?.id ?? 'none'} (${dashboard.topRisks[0]?.confidence ?? '-'})`);
