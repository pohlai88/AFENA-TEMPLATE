/**
 * Matrix emitter — generates .afenda/capability.matrix.md
 * Human-readable coverage table.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

import { getOrInit } from '../../core/get-or-init';

import type { CapabilityLedger } from './ledger';

function statusEmoji(status: string): string {
  switch (status) {
    case 'covered':
      return '✅';
    case 'orphaned':
      return '⚠️';
    case 'phantom':
      return '👻';
    case 'excepted':
      return '🔕';
    case 'planned':
      return '📋';
    default:
      return '❓';
  }
}

function groupBy<T>(items: T[], keyFn: (item: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    getOrInit(map, key).push(item);
  }
  return map;
}

/**
 * Generate a markdown coverage matrix from the ledger.
 */
export function generateMatrix(ledger: CapabilityLedger): string {
  const lines: string[] = [];

  lines.push('# Capability Coverage Matrix');
  lines.push('');
  lines.push(`> Generated at ${ledger.generatedAt} | Policy phase ${ledger.policyPhase}`);
  lines.push('');

  // Summary
  lines.push('## Summary');
  lines.push('');
  lines.push(`| Status | Count |`);
  lines.push(`| ------ | ----- |`);
  lines.push(`| ✅ Covered | ${ledger.summary.covered} |`);
  lines.push(`| ⚠️ Orphaned | ${ledger.summary.orphaned} |`);
  lines.push(`| 👻 Phantom | ${ledger.summary.phantom} |`);
  lines.push(`| 🔕 Excepted | ${ledger.summary.excepted} |`);
  lines.push(`| 📋 Planned | ${ledger.summary.planned} |`);
  lines.push(`| **Total** | **${ledger.summary.total}** |`);
  lines.push('');

  // Group by kind
  const byKind = groupBy(ledger.entries, (e) => e.kind);

  for (const [kind, entries] of byKind) {
    lines.push(`## ${kind.charAt(0).toUpperCase() + kind.slice(1)} Capabilities`);
    lines.push('');
    lines.push('| Key | Status | Surfaces | UI |');
    lines.push('| --- | ------ | -------- | -- |');

    for (const entry of entries) {
      const surfaceCount = entry.surfaces.length;
      const uiCount = entry.uiSurfaces.length;
      const surfaceStr = surfaceCount > 0 ? `${surfaceCount} surface(s)` : '—';
      const uiStr = uiCount > 0 ? `${uiCount} page(s)` : '—';
      lines.push(
        `| \`${entry.key}\` | ${statusEmoji(entry.status)} ${entry.status} | ${surfaceStr} | ${uiStr} |`,
      );
    }

    lines.push('');
  }

  // Exceptions section
  const excepted = ledger.entries.filter((e) => e.exception);
  if (excepted.length > 0) {
    lines.push('## Active Exceptions');
    lines.push('');
    lines.push('| ID | Key | Rule | Reason | Expires |');
    lines.push('| -- | --- | ---- | ------ | ------- |');
    for (const entry of excepted) {
      const exc = entry.exception;
      if (!exc) continue;
      const overdue = exc.reviewOverdue ? ' ⏰' : '';
      lines.push(
        `| ${exc.id} | \`${entry.key}\` | ${exc.rule} | ${exc.reason} | ${exc.expiresOn}${overdue} |`,
      );
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Write the matrix to .afenda/capability.matrix.md.
 */
export function writeMatrix(repoRoot: string, markdown: string): void {
  const outPath = join(repoRoot, '.afenda', 'capability.matrix.md');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, `${markdown  }\n`, 'utf-8');
}
