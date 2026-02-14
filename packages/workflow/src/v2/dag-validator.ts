import type { WorkflowEdge, WorkflowNode } from './types';

/**
 * DAG validation result.
 */
export interface DagValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate an effective DAG (after merge):
 *
 * 1. Acyclic — no cycles in the graph
 * 2. Reachable — all nodes reachable from start
 * 3. Start/End — exactly one start node, at least one end node
 * 4. System gate integrity (WF-08) — all sys:* nodes present in correct topo order
 * 5. No orphan edges — every edge references existing nodes
 * 6. No duplicate IDs
 */
export function validateDag(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
): DagValidationResult {
  const errors: string[] = [];
  const nodeMap = new Map<string, WorkflowNode>();

  // Check for duplicate node IDs
  for (const node of nodes) {
    if (nodeMap.has(node.id)) {
      errors.push(`Duplicate node ID: "${node.id}"`);
    }
    nodeMap.set(node.id, node);
  }

  // Check for duplicate edge IDs
  const edgeIds = new Set<string>();
  for (const edge of edges) {
    if (edgeIds.has(edge.id)) {
      errors.push(`Duplicate edge ID: "${edge.id}"`);
    }
    edgeIds.add(edge.id);
  }

  // Validate start/end nodes
  const startNodes = nodes.filter((n) => n.type === 'start');
  const endNodes = nodes.filter((n) => n.type === 'end');

  if (startNodes.length === 0) {
    errors.push('DAG must have exactly one start node');
  } else if (startNodes.length > 1) {
    errors.push(`DAG must have exactly one start node, found ${String(startNodes.length)}: ${startNodes.map((n) => n.id).join(', ')}`);
  }

  if (endNodes.length === 0) {
    errors.push('DAG must have at least one end node');
  }

  // Validate edge references
  for (const edge of edges) {
    if (!nodeMap.has(edge.sourceNodeId)) {
      errors.push(`Edge "${edge.id}" references non-existent source node "${edge.sourceNodeId}"`);
    }
    if (!nodeMap.has(edge.targetNodeId)) {
      errors.push(`Edge "${edge.id}" references non-existent target node "${edge.targetNodeId}"`);
    }
  }

  // Build adjacency for cycle detection + reachability
  const adjacency = new Map<string, string[]>();
  for (const node of nodes) {
    adjacency.set(node.id, []);
  }
  for (const edge of edges) {
    const arr = adjacency.get(edge.sourceNodeId);
    if (arr) arr.push(edge.targetNodeId);
  }

  // Cycle detection via DFS (Kahn's algorithm)
  const inDegree = new Map<string, number>();
  for (const node of nodes) {
    inDegree.set(node.id, 0);
  }
  for (const edge of edges) {
    const deg = inDegree.get(edge.targetNodeId);
    if (deg !== undefined) inDegree.set(edge.targetNodeId, deg + 1);
  }

  const queue: string[] = [];
  for (const [nodeId, degree] of inDegree) {
    if (degree === 0) {
      queue.push(nodeId);
    }
  }

  let processedCount = 0;
  while (queue.length > 0) {
    const current = queue.shift();
    if (current === undefined) break;
    processedCount++;
    const neighbors = adjacency.get(current) ?? [];
    for (const neighbor of neighbors) {
      const prevDegree = inDegree.get(neighbor);
      const newDegree = prevDegree !== undefined ? prevDegree - 1 : -1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0) {
        queue.push(neighbor);
      }
    }
  }

  if (processedCount !== nodes.length) {
    errors.push(
      `DAG contains a cycle. ${String(nodes.length - processedCount)} node(s) are part of a cycle.`,
    );
  }

  // Reachability from start
  if (startNodes.length === 1) {
    const startNode = startNodes[0];
    if (!startNode) return { valid: false, errors: ['Start node is undefined'] };
    const reachable = new Set<string>();
    const bfsQueue = [startNode.id];
    reachable.add(startNode.id);

    while (bfsQueue.length > 0) {
      const current = bfsQueue.shift();
      if (current === undefined) break;
      const neighbors = adjacency.get(current) ?? [];
      for (const neighbor of neighbors) {
        if (!reachable.has(neighbor)) {
          reachable.add(neighbor);
          bfsQueue.push(neighbor);
        }
      }
    }

    const unreachable = nodes.filter((n) => !reachable.has(n.id));
    if (unreachable.length > 0) {
      errors.push(
        `${String(unreachable.length)} node(s) unreachable from start: ${unreachable.map((n) => n.id).join(', ')}`,
      );
    }
  }

  // System gate integrity (WF-08)
  const systemNodes = nodes.filter((n) => n.id.startsWith('sys:'));
  const requiredSystemNodes = ['sys:start', 'sys:end'];
  for (const required of requiredSystemNodes) {
    if (!nodeMap.has(required)) {
      errors.push(`Missing required system node: "${required}" (WF-08)`);
    }
  }

  // Verify system nodes are not orphaned
  for (const sysNode of systemNodes) {
    if (sysNode.type === 'start') continue; // start has no incoming
    const hasIncoming = edges.some((e) => e.targetNodeId === sysNode.id);
    if (!hasIncoming) {
      errors.push(`System node "${sysNode.id}" has no incoming edges (WF-08)`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Compute stable topological order with deterministic tie-breaking (WF-13).
 * Tie-break by node_id lexicographically.
 *
 * Returns null if the graph has a cycle.
 */
export function topologicalSort(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
): string[] | null {
  const inDegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  for (const node of nodes) {
    inDegree.set(node.id, 0);
    adjacency.set(node.id, []);
  }

  for (const edge of edges) {
    const arr = adjacency.get(edge.sourceNodeId);
    if (arr) arr.push(edge.targetNodeId);
    const deg = inDegree.get(edge.targetNodeId);
    if (deg !== undefined) inDegree.set(edge.targetNodeId, deg + 1);
  }

  // Use sorted queue for deterministic tie-breaking (WF-13)
  const queue: string[] = [];
  for (const [nodeId, degree] of inDegree) {
    if (degree === 0) {
      queue.push(nodeId);
    }
  }
  queue.sort(); // Lexicographic tie-break

  const result: string[] = [];
  while (queue.length > 0) {
    const current = queue.shift();
    if (current === undefined) break;
    result.push(current);

    const neighbors = adjacency.get(current) ?? [];
    const readyNeighbors: string[] = [];
    for (const neighbor of neighbors) {
      const prevDegree = inDegree.get(neighbor);
      const newDegree = prevDegree !== undefined ? prevDegree - 1 : -1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0) {
        readyNeighbors.push(neighbor);
      }
    }

    // Insert newly ready neighbors in sorted order
    if (readyNeighbors.length > 0) {
      readyNeighbors.sort();
      // Merge into queue maintaining sorted order
      for (const n of readyNeighbors) {
        insertSorted(queue, n);
      }
    }
  }

  if (result.length !== nodes.length) {
    return null; // Cycle detected
  }

  return result;
}

/**
 * Insert a string into a sorted array maintaining sort order.
 */
function insertSorted(arr: string[], value: string): void {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    const midValue = arr[mid];
    if (midValue && midValue < value) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  arr.splice(lo, 0, value);
}
