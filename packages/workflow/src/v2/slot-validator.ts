import type { BodySlot, SlotGraphPatch } from './types';

/**
 * Slot validation result.
 */
export interface SlotValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate a slot graph patch against WF-06 rules:
 *
 * 1. Every custom node ID must match `usr:<slotId>:<uuid>` namespace
 * 2. Every custom edge must stay within slot nodes + attachment points
 * 3. No edges may target `sys:*` nodes except via slot attachment points
 * 4. Edit window override can only be stricter, never looser
 *
 * @param slotId - The slot being patched
 * @param patch - The org-authored patch
 * @param slot - The slot declaration from the envelope
 */
export function validateSlotPatch(
  slotId: string,
  patch: SlotGraphPatch,
  slot: BodySlot,
): SlotValidationResult {
  const errors: string[] = [];
  const prefix = `usr:${slotId}:`;

  // Collect valid node IDs within this patch scope
  const patchNodeIds = new Set<string>();
  const attachmentPoints = new Set([slot.entryNodeId, slot.exitNodeId]);

  // 1. Validate node ID namespace (WF-06)
  for (const node of patch.nodes) {
    if (!node.id.startsWith(prefix)) {
      errors.push(
        `Node "${node.id}" violates WF-06: custom node IDs must start with "${prefix}". Got: "${node.id}"`,
      );
    }
    patchNodeIds.add(node.id);
  }

  // Build the set of all valid node references for edges in this slot
  const validNodeRefs = new Set([...patchNodeIds, ...attachmentPoints]);

  // 2. Validate edge scope (WF-06)
  for (const edge of patch.edges) {
    // Source must be a patch node or an attachment point
    if (!validNodeRefs.has(edge.sourceNodeId)) {
      errors.push(
        `Edge "${edge.id}" source "${edge.sourceNodeId}" is outside slot scope. ` +
        `Valid: patch nodes (${prefix}*) or attachment points (${[...attachmentPoints].join(', ')})`,
      );
    }

    // Target must be a patch node or an attachment point
    if (!validNodeRefs.has(edge.targetNodeId)) {
      errors.push(
        `Edge "${edge.id}" target "${edge.targetNodeId}" is outside slot scope. ` +
        `Valid: patch nodes (${prefix}*) or attachment points (${[...attachmentPoints].join(', ')})`,
      );
    }

    // 3. No targeting sys:* nodes except attachment points
    if (edge.targetNodeId.startsWith('sys:') && !attachmentPoints.has(edge.targetNodeId)) {
      errors.push(
        `Edge "${edge.id}" targets system node "${edge.targetNodeId}" which is not a slot attachment point. ` +
        `Only "${slot.entryNodeId}" and "${slot.exitNodeId}" are valid system targets.`,
      );
    }

    if (edge.sourceNodeId.startsWith('sys:') && !attachmentPoints.has(edge.sourceNodeId)) {
      errors.push(
        `Edge "${edge.id}" sources from system node "${edge.sourceNodeId}" which is not a slot attachment point. ` +
        `Only "${slot.entryNodeId}" and "${slot.exitNodeId}" are valid system sources.`,
      );
    }
  }

  // 4. Edit window override strictness (can only tighten, not loosen)
  if (patch.editWindowOverride) {
    const strictnessOrder = { editable: 0, amend_only: 1, locked: 2 } as const;
    const defaultLevel = strictnessOrder[slot.defaultEditWindow];
    const overrideLevel = strictnessOrder[patch.editWindowOverride];

    if (overrideLevel < defaultLevel) {
      errors.push(
        `Edit window override "${patch.editWindowOverride}" is looser than slot default "${slot.defaultEditWindow}". ` +
        `Overrides can only be stricter (editable → amend_only → locked).`,
      );
    }
  }

  // 5. Validate patch has at least one node if it has edges
  if (patch.edges.length > 0 && patch.nodes.length === 0) {
    errors.push('Patch has edges but no nodes. A non-empty patch must define at least one custom node.');
  }

  // 6. Check for duplicate node IDs
  const seenNodeIds = new Set<string>();
  for (const node of patch.nodes) {
    if (seenNodeIds.has(node.id)) {
      errors.push(`Duplicate node ID "${node.id}" in patch for slot "${slotId}".`);
    }
    seenNodeIds.add(node.id);
  }

  // 7. Check for duplicate edge IDs
  const seenEdgeIds = new Set<string>();
  for (const edge of patch.edges) {
    if (seenEdgeIds.has(edge.id)) {
      errors.push(`Duplicate edge ID "${edge.id}" in patch for slot "${slotId}".`);
    }
    seenEdgeIds.add(edge.id);
  }

  return { valid: errors.length === 0, errors };
}
