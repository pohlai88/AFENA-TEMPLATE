import { canonicalJsonHash } from './canonical-json';
import { topologicalSort, validateDag } from './dag-validator';
import { validateSlotPatch } from './slot-validator';
import { COMPILER_VERSION } from './types';

import type {
  BodySlot,
  CompiledEdge,
  CompiledWorkflow,
  EditWindow,
  SlotGraphPatch,
  WorkflowEdge,
  WorkflowNode,
} from './types';

/**
 * Compile result — either success with compiled workflow, or failure with errors.
 */
export type CompileResult =
  | { ok: true; compiled: CompiledWorkflow }
  | { ok: false; errors: string[] };

/**
 * compileEffective(envelope, bodyPatches) → CompiledWorkflow
 *
 * Deterministic, compile-time merge (PRD § Merge Algorithm):
 *
 * 1. Validate each slot patch (WF-06)
 * 2. Create attachment proxy nodes per patched slot
 * 3. Replace direct envelope edges with slot-routed edges
 * 4. Propagate edit windows (override only if stricter)
 * 5. Tag stable region nodes (WF-05)
 * 6. Verify system gate integrity (WF-08)
 * 7. Sort nodes/edges by ID (WF-12: deterministic compile)
 * 8. Compute topological order with stable tie-break (WF-13)
 * 9. Build edge-first adjacency maps
 * 10. Hash the result
 */
export function compileEffective(
  envelopeNodes: WorkflowNode[],
  envelopeEdges: WorkflowEdge[],
  envelopeSlots: BodySlot[],
  bodyPatches: Record<string, SlotGraphPatch>,
  envelopeVersion: number,
): CompileResult {
  const errors: string[] = [];

  // Deep-copy to avoid mutating inputs
  const effectiveNodes: WorkflowNode[] = envelopeNodes.map((n) => ({ ...n }));
  const effectiveEdges: WorkflowEdge[] = envelopeEdges.map((e) => ({ ...e }));

  const slotMap: Record<string, string> = {};
  const editWindows: Record<string, EditWindow> = {};
  const stableRegionNodes: string[] = [];

  // Build slot lookup
  const slotById = new Map<string, BodySlot>();
  for (const slot of envelopeSlots) {
    slotById.set(slot.slotId, slot);
  }

  // Initialize edit windows from envelope nodes
  for (const node of effectiveNodes) {
    if (node.editWindow) {
      editWindows[node.id] = node.editWindow;
    }
  }

  // Process each body patch
  for (const [slotId, patch] of Object.entries(bodyPatches)) {
    const slot = slotById.get(slotId);
    if (!slot) {
      errors.push(`Patch references unknown slot: "${slotId}"`);
      continue;
    }

    // 1. Validate patch scope (WF-06)
    const validation = validateSlotPatch(slotId, patch, slot);
    if (!validation.valid) {
      errors.push(...validation.errors);
      continue;
    }

    // Skip empty patches
    if (patch.nodes.length === 0) continue;

    // 2. Create attachment proxy nodes
    const slotInId = `sys:slot:${slotId}:in`;
    const slotOutId = `sys:slot:${slotId}:out`;

    effectiveNodes.push({
      id: slotInId,
      type: 'policy_gate',
      label: `${slotId} entry`,
      editWindow: slot.defaultEditWindow,
    });
    effectiveNodes.push({
      id: slotOutId,
      type: 'policy_gate',
      label: `${slotId} exit`,
      editWindow: slot.defaultEditWindow,
    });

    // 3. Replace direct envelope edge (entry → exit) with slot-routed edges
    // Find and remove the direct edge between slot entry and exit
    const directEdgeIdx = effectiveEdges.findIndex(
      (e) => e.sourceNodeId === slot.entryNodeId && e.targetNodeId === slot.exitNodeId,
    );
    if (directEdgeIdx !== -1) {
      effectiveEdges.splice(directEdgeIdx, 1);
    }

    // Add routing edges: entry → slot:in
    effectiveEdges.push({
      id: `sys:edge:${slotId}:entry_to_in`,
      sourceNodeId: slot.entryNodeId,
      targetNodeId: slotInId,
      priority: 0,
    });

    // Determine first and last custom nodes based on entry/exit edge modes
    const firstNode = patch.nodes[0];
    const lastNode = patch.nodes[patch.nodes.length - 1];
    if (!firstNode || !lastNode) {
      return { ok: false, errors: [`Slot ${slotId} has no nodes`] };
    }
    const firstCustomNode = firstNode.id;
    const lastCustomNode = lastNode.id;

    // slot:in → first custom node
    effectiveEdges.push({
      id: `sys:edge:${slotId}:in_to_first`,
      sourceNodeId: slotInId,
      targetNodeId: firstCustomNode,
      priority: 0,
    });

    // last custom node → slot:out
    effectiveEdges.push({
      id: `sys:edge:${slotId}:last_to_out`,
      sourceNodeId: lastCustomNode,
      targetNodeId: slotOutId,
      priority: 0,
    });

    // slot:out → exit
    effectiveEdges.push({
      id: `sys:edge:${slotId}:out_to_exit`,
      sourceNodeId: slotOutId,
      targetNodeId: slot.exitNodeId,
      priority: 0,
    });

    // Add patch nodes and edges
    for (const node of patch.nodes) {
      effectiveNodes.push({ ...node });
      slotMap[node.id] = slotId;
    }
    for (const edge of patch.edges) {
      effectiveEdges.push({ ...edge });
    }

    // Map proxy nodes to slot
    slotMap[slotInId] = slotId;
    slotMap[slotOutId] = slotId;

    // 4. Propagate edit windows
    const effectiveEditWindow = resolveStricterEditWindow(
      slot.defaultEditWindow,
      patch.editWindowOverride,
    );
    editWindows[slotInId] = effectiveEditWindow;
    editWindows[slotOutId] = effectiveEditWindow;
    for (const node of patch.nodes) {
      editWindows[node.id] = node.editWindow ?? effectiveEditWindow;
    }

    // 5. Tag stable region nodes (WF-05)
    if (slot.stableRegion) {
      stableRegionNodes.push(slotInId, slotOutId);
      for (const node of patch.nodes) {
        stableRegionNodes.push(node.id);
      }
    }
  }

  // Return early if validation errors
  if (errors.length > 0) {
    return { ok: false, errors };
  }

  // 6. Validate the effective DAG
  const dagValidation = validateDag(effectiveNodes, effectiveEdges);
  if (!dagValidation.valid) {
    return { ok: false, errors: dagValidation.errors };
  }

  // 7. Sort nodes and edges by ID for deterministic output (WF-12)
  effectiveNodes.sort((a, b) => a.id.localeCompare(b.id));
  effectiveEdges.sort((a, b) => a.id.localeCompare(b.id));

  // 8. Compute topological order with stable tie-break (WF-13)
  const topoOrder = topologicalSort(effectiveNodes, effectiveEdges);
  if (!topoOrder) {
    return { ok: false, errors: ['Topological sort failed — graph contains a cycle'] };
  }

  // 9. Build edge-first adjacency maps
  const adjacency: Record<string, string[]> = {};
  const reverseAdjacency: Record<string, string[]> = {};
  const edgesById: Record<string, CompiledEdge> = {};

  for (const node of effectiveNodes) {
    adjacency[node.id] = [];
    reverseAdjacency[node.id] = [];
  }

  for (const edge of effectiveEdges) {
    const compiledEdge: CompiledEdge = {
      id: edge.id,
      source: edge.sourceNodeId,
      target: edge.targetNodeId,
      priority: edge.priority ?? 0,
      ...(edge.condition ? { condition: edge.condition } : {}),
      ...(edge.label ? { label: edge.label } : {}),
      provenance: resolveEdgeProvenance(edge.id, slotMap),
    };
    edgesById[edge.id] = compiledEdge;

    const sourceAdj = adjacency[edge.sourceNodeId];
    if (sourceAdj) {
      sourceAdj.push(edge.id);
    }
    const targetAdj = reverseAdjacency[edge.targetNodeId];
    if (targetAdj) {
      targetAdj.push(edge.id);
    }
  }

  // Sort adjacency edge lists by priority then edge ID for determinism
  for (const nodeId of Object.keys(adjacency)) {
    const edgeList = adjacency[nodeId];
    if (!edgeList) continue;
    edgeList.sort((a, b) => {
      const ea = edgesById[a];
      const eb = edgesById[b];
      if (!ea || !eb) return 0;
      if (ea.priority !== eb.priority) return ea.priority - eb.priority;
      return ea.id.localeCompare(eb.id);
    });
  }

  // System gate integrity (WF-08)
  const systemGateNodes = effectiveNodes
    .filter((n) => n.id.startsWith('sys:gate:') || n.id.startsWith('sys:state:'))
    .map((n) => n.id);
  const requiredGates = ['sys:start', 'sys:end'];
  const presentGates = effectiveNodes
    .filter((n) => requiredGates.includes(n.id))
    .map((n) => n.id);

  const systemGateIntegrity = {
    requiredGates: [...requiredGates, ...systemGateNodes].sort(),
    presentGates: [...presentGates, ...systemGateNodes].sort(),
    valid: requiredGates.every((g) => effectiveNodes.some((n) => n.id === g)),
  };

  // Sort stable region nodes for determinism
  stableRegionNodes.sort();

  // 10. Build the compiled workflow (without hash — hash computed from content)
  const compiledContent = {
    adjacency,
    reverseAdjacency,
    edgesById,
    topologicalOrder: topoOrder,
    joinRequirements: {} as CompiledWorkflow['joinRequirements'],
    editWindows,
    stableRegionNodes,
    slotMap,
    systemGateIntegrity,
    envelopeVersion,
    compilerVersion: COMPILER_VERSION,
  };

  // Compute hash from the compiled content (deterministic because all inputs are sorted)
  const hash = canonicalJsonHash(compiledContent);

  const compiled: CompiledWorkflow = {
    ...compiledContent,
    hash,
  };

  return { ok: true, compiled };
}

/**
 * Resolve the stricter of two edit windows.
 * Strictness order: editable < amend_only < locked
 */
function resolveStricterEditWindow(
  base: EditWindow,
  override?: EditWindow,
): EditWindow {
  if (!override) return base;

  const strictnessOrder: Record<EditWindow, number> = {
    editable: 0,
    amend_only: 1,
    locked: 2,
  };

  return strictnessOrder[override] >= strictnessOrder[base] ? override : base;
}

/**
 * Determine edge provenance — 'envelope' for system edges, slotId for slot-contributed edges.
 */
function resolveEdgeProvenance(
  edgeId: string,
  slotMap: Record<string, string>,
): string {
  // System edges start with 'sys:'
  if (edgeId.startsWith('sys:')) return 'envelope';

  // Check if edge ID contains a slot reference
  for (const slotId of Object.values(slotMap)) {
    if (edgeId.startsWith(`usr:${slotId}:`)) return slotId;
  }

  return 'envelope';
}
