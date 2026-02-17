/**
 * Mermaid emitter — generates capability flow diagrams.
 * Produces a Mermaid flowchart showing capabilities grouped by kind,
 * with edges from surfaces to capabilities and from capabilities to entities.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

import type { CapabilityLedger } from './ledger';
import type { PackageGraph } from '../collectors/package-graph';

/**
 * Generate a Mermaid flowchart from the capability ledger.
 */
export function generateCapabilityMermaid(ledger: CapabilityLedger): string {
  const lines: string[] = [];
  lines.push('```mermaid');
  lines.push('flowchart LR');
  lines.push('');

  // Group capabilities by kind
  const byKind = new Map<string, typeof ledger.entries>();
  for (const entry of ledger.entries) {
    const group = byKind.get(entry.kind) ?? [];
    group.push(entry);
    byKind.set(entry.kind, group);
  }

  // Emit subgraphs per kind
  for (const [kind, entries] of byKind) {
    const kindId = kind.replace(/[^a-zA-Z0-9]/g, '_');
    lines.push(`  subgraph ${kindId}["${kind.toUpperCase()}"]`);
    for (const entry of entries) {
      const nodeId = entry.key.replace(/[^a-zA-Z0-9]/g, '_');
      const statusIcon =
        entry.status === 'covered' ? '✅' :
        entry.status === 'orphaned' ? '⚠️' :
        entry.status === 'phantom' ? '👻' :
        entry.status === 'excepted' ? '🛡️' :
        '📋';
      lines.push(`    ${nodeId}["${statusIcon} ${entry.key}"]`);
    }
    lines.push('  end');
    lines.push('');
  }

  // Emit edges from surfaces to capabilities
  const surfaceNodes = new Set<string>();
  for (const entry of ledger.entries) {
    for (const surface of entry.surfaces) {
      const surfaceId = surface.file.replace(/[^a-zA-Z0-9]/g, '_');
      if (!surfaceNodes.has(surfaceId)) {
        const shortName = surface.file.split('/').pop() ?? surface.file;
        lines.push(`  ${surfaceId}[/"${shortName}"/]`);
        surfaceNodes.add(surfaceId);
      }
      const capId = entry.key.replace(/[^a-zA-Z0-9]/g, '_');
      lines.push(`  ${surfaceId} --> ${capId}`);
    }
  }

  lines.push('```');
  return lines.join('\n');
}

/**
 * Generate a Mermaid dependency graph from the package graph.
 */
export function generateDependencyMermaid(graph: PackageGraph): string {
  const lines: string[] = [];
  lines.push('```mermaid');
  lines.push('flowchart TD');
  lines.push('');

  for (const node of graph.nodes) {
    const nodeId = node.name.replace(/[^a-zA-Z0-9]/g, '_');
    lines.push(`  ${nodeId}["${node.name}"]`);
  }

  lines.push('');

  for (const edge of graph.edges) {
    const fromId = edge.from.replace(/[^a-zA-Z0-9]/g, '_');
    const toId = edge.to.replace(/[^a-zA-Z0-9]/g, '_');
    if (edge.dev) {
      lines.push(`  ${fromId} -.-> ${toId}`);
    } else {
      lines.push(`  ${fromId} --> ${toId}`);
    }
  }

  lines.push('```');
  return lines.join('\n');
}

/**
 * Write Mermaid diagrams to .afena/capability.mermaid.md
 */
export function writeMermaid(
  repoRoot: string,
  capabilityDiagram: string,
  dependencyDiagram: string,
): void {
  const content = [
    '# Capability Flow Diagrams',
    '',
    `> Generated at ${new Date().toISOString()}`,
    '',
    '## Capability Coverage',
    '',
    capabilityDiagram,
    '',
    '## Package Dependencies',
    '',
    dependencyDiagram,
    '',
  ].join('\n');

  const outPath = join(repoRoot, '.afena', 'capability.mermaid.md');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, content, 'utf-8');
}
