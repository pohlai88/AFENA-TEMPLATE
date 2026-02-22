/**
 * Design-Time Lineage System
 *
 * Tracks data flow between metadata assets at design time.
 * Instance-level lineage (doc → mutation → posting) deferred to v2.
 *
 * Invariants (locked - see canon.architecture.md §7.4):
 * L0: Edge validation
 * L1: Cycle detection
 * L2: Confidence tracking
 */

import { parseAssetKey } from './asset-keys';

import type { MetaEdgeType } from '../../enums/meta-edge-type';

/**
 * Design-time lineage edge
 * Links two assets with an explicit relationship type
 */
export interface LineageEdge {
  fromAssetKey: string;
  toAssetKey: string;
  edgeType: MetaEdgeType;
  metadata?: Record<string, unknown>;
}

/**
 * Infer edge type from asset key prefixes
 * Returns confidence + reasoning for explainability
 *
 * Examples:
 * - db.field → db.field: 'transforms' (confidence 1.0)
 * - db.rec → db.rec: 'ingests' or 'derives' (confidence 0.6 - ambiguous)
 * - db.bo → db.api: 'serves' (confidence 1.0)
 */
export function inferEdgeType(
  fromParsed: { prefix: string | null; segments: string[] },
  toParsed: { prefix: string | null; segments: string[] }
): {
  edgeType: MetaEdgeType;
  confidence: number;
  reason: string;
} {
  // Field to field: transforms (e.g., invoice.total <- invoice.subtotal + invoice.tax)
  if (fromParsed.prefix === 'db.field' && toParsed.prefix === 'db.field') {
    // Same table? Could be 'transforms' within table
    const fromTable = fromParsed.segments.slice(0, 3).join('.');
    const toTable = toParsed.segments.slice(0, 3).join('.');
    if (fromTable === toTable) {
      return {
        edgeType: 'transforms',
        confidence: 1.0,
        reason: 'Field within same table transforms to another field',
      };
    }
    return {
      edgeType: 'transforms',
      confidence: 0.9,
      reason: 'Field in one table transforms to field in another',
    };
  }

  // Record to record: ingests or derives (ambiguous)
  if (fromParsed.prefix === 'db.rec' && toParsed.prefix === 'db.rec') {
    return {
      edgeType: 'ingests',
      confidence: 0.6,
      reason: 'Record-to-record relationship (could be ingests or derives - inferred as ingests)',
    };
  }

  // Record to field: transforms (field derived from table data)
  if (fromParsed.prefix === 'db.rec' && toParsed.prefix === 'db.field') {
    return {
      edgeType: 'transforms',
      confidence: 0.9,
      reason: 'Record provides input for field transformation',
    };
  }

  // Record to view: serves
  if (fromParsed.prefix === 'db.rec' && toParsed.prefix === 'db.view') {
    return {
      edgeType: 'serves',
      confidence: 1.0,
      reason: 'Table data served in UI view',
    };
  }

  // Record to report: serves
  if (fromParsed.prefix === 'db.rec' && toParsed.prefix === 'db.report') {
    return {
      edgeType: 'serves',
      confidence: 1.0,
      reason: 'Table data serves report/dashboard',
    };
  }

  // BO to API: serves
  if (fromParsed.prefix === 'db.bo' && toParsed.prefix === 'db.api') {
    return {
      edgeType: 'serves',
      confidence: 1.0,
      reason: 'Business object is served by API contract',
    };
  }

  // Field to API: serves
  if (fromParsed.prefix === 'db.field' && toParsed.prefix === 'db.api') {
    return {
      edgeType: 'serves',
      confidence: 0.85,
      reason: 'Field is part of API response',
    };
  }

  // Default: derives (generic fallback)
  return {
    edgeType: 'derives',
    confidence: 0.5,
    reason: `Default inference for ${fromParsed.prefix} → ${toParsed.prefix}`,
  };
}

/**
 * Validate that a lineage edge references valid asset keys
 * L0 invariant: prevents garbage edges from entering storage
 */
export function validateLineageEdge(edge: LineageEdge): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate both keys
  const fromParsed = parseAssetKey(edge.fromAssetKey);
  const toParsed = parseAssetKey(edge.toAssetKey);

  if (!fromParsed.valid) {
    errors.push(`Invalid fromAssetKey: ${fromParsed.errors.join('; ')}`);
  }
  if (!toParsed.valid) {
    errors.push(`Invalid toAssetKey: ${toParsed.errors.join('; ')}`);
  }

  // Ensure keys are different
  if (edge.fromAssetKey === edge.toAssetKey) {
    errors.push('Self-loops not allowed (fromAssetKey === toAssetKey)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Topologically sort assets and detect cycles
 * L1 invariant: detects all cycles
 *
 * @param edges - Lineage edges
 * @returns Topologically sorted asset keys + all detected cycles
 */
export function topoSortLineage(edges: LineageEdge[]): {
  sorted: string[];
  cycles: string[][];
} {
  const graph: Map<string, Set<string>> = new Map();
  const inDegree: Map<string, number> = new Map();
  const cycles: string[][] = [];

  // Build graph
  for (const edge of edges) {
    if (!graph.has(edge.fromAssetKey)) {
      graph.set(edge.fromAssetKey, new Set());
      inDegree.set(edge.fromAssetKey, 0);
    }
    if (!graph.has(edge.toAssetKey)) {
      graph.set(edge.toAssetKey, new Set());
      inDegree.set(edge.toAssetKey, 0);
    }

    if (!graph.get(edge.fromAssetKey)!.has(edge.toAssetKey)) {
      graph.get(edge.fromAssetKey)!.add(edge.toAssetKey);
      inDegree.set(edge.toAssetKey, (inDegree.get(edge.toAssetKey) || 0) + 1);
    }
  }

  // Kahn's algorithm for topological sort
  const queue: string[] = [];
  for (const [node, degree] of inDegree) {
    if (degree === 0) queue.push(node);
  }

  const sorted: string[] = [];
  while (queue.length > 0) {
    const node = queue.shift()!;
    sorted.push(node);

    for (const neighbor of graph.get(node) || []) {
      inDegree.set(neighbor, (inDegree.get(neighbor) || 0) - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    }
  }

  // Detect cycles: any node with inDegree > 0 is part of a cycle
  if (sorted.length < graph.size) {
    const visited = new Set(sorted);
    for (const [node] of inDegree) {
      if (!visited.has(node)) {
        // Simple cycle detection: find path from node back to itself
        const cycle = findCycle(node, graph, new Set(), []);
        if (cycle) cycles.push(cycle);
      }
    }
  }

  return { sorted, cycles };
}

/**
 * Find a cycle starting from a node using DFS
 */
function findCycle(
  node: string,
  graph: Map<string, Set<string>>,
  visited: Set<string>,
  path: string[]
): string[] | null {
  if (visited.has(node)) {
    const cycleStart = path.indexOf(node);
    if (cycleStart >= 0) {
      return path.slice(cycleStart).concat(node);
    }
    return null;
  }

  visited.add(node);
  path.push(node);

  for (const neighbor of graph.get(node) || []) {
    const cycle = findCycle(neighbor, graph, visited, path);
    if (cycle) return cycle;
  }

  path.pop();
  return null;
}

/**
 * Generate human-readable explanation for a lineage edge
 * Useful for UI tooltips and logs
 */
export function explainLineageEdge(edge: LineageEdge): string {
  const inferredInfo = (() => {
    const fromParsed = parseAssetKey(edge.fromAssetKey);
    const toParsed = parseAssetKey(edge.toAssetKey);

    if (!fromParsed.valid || !toParsed.valid) {
      return '(invalid keys)';
    }

    return `${fromParsed.prefix} → ${toParsed.prefix}`;
  })();

  return `${edge.fromAssetKey} [${edge.edgeType}] → ${edge.toAssetKey} ${inferredInfo}`;
}
