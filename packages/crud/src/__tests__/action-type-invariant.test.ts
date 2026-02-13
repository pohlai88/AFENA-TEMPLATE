/**
 * W2 — ActionType Invariant (Completeness Gate)
 *
 * Enforces G0: HANDLER_REGISTRY ↔ ACTION_TYPES cannot diverge.
 *
 * Canonical formula: ActionType = `${entityType}.${verb}`
 *   - entityType = key in HANDLER_REGISTRY (must equal Canon EntityType)
 *   - verb = handler method that exists (not undefined)
 *
 * Two-way check:
 *   1. Every (entityType × supportedVerb) → must exist in ACTION_TYPES
 *   2. Every ACTION_TYPES entry → must map to a handler verb OR be allowlisted
 */

import { describe, expect, it } from 'vitest';

import { ACTION_TYPES, ENTITY_TYPES } from 'afena-canon';

import { getRegisteredHandlerMeta } from '../handler-meta';

/**
 * Orphan allowlist — Canon action types that legitimately have no CRUD handler.
 * Each entry MUST include a comment explaining why it is not CRUD-handled.
 */
const ACTION_TYPES_ALLOW_ORPHANS: string[] = [
  // Currently empty — all action types map to CRUD handlers.
  // Add entries here with comments when system/meta/workflow actions are introduced.
  // Example: 'meta_assets.reindex' — system job; not an entity mutation
];

describe('G0 — ActionType Invariant', () => {
  const handlerMeta = getRegisteredHandlerMeta();
  const actionTypesSet = new Set<string>(ACTION_TYPES);
  const entityTypesSet = new Set<string>(ENTITY_TYPES);

  it('HANDLER_REGISTRY keys must match Canon ENTITY_TYPES', () => {
    const handlerKeys = Array.from(handlerMeta.keys());
    const missingFromCanon = handlerKeys.filter((k) => !entityTypesSet.has(k));

    expect(
      missingFromCanon,
      `Handler keys not in ENTITY_TYPES: ${missingFromCanon.join(', ')}. ` +
        'Add them to packages/canon/src/types/entity.ts',
    ).toEqual([]);
  });

  it('every (entityType × supportedVerb) must exist in ACTION_TYPES', () => {
    const missing: string[] = [];

    for (const [entityType, verbs] of handlerMeta) {
      for (const verb of verbs) {
        const actionType = `${entityType}.${verb}`;
        if (!actionTypesSet.has(actionType)) {
          missing.push(actionType);
        }
      }
    }

    expect(
      missing,
      `Missing ACTION_TYPES entries: ${missing.join(', ')}. ` +
        'Add them to packages/canon/src/types/action.ts',
    ).toEqual([]);
  });

  it('every ACTION_TYPES entry must map to a handler verb or be allowlisted', () => {
    const orphanAllowSet = new Set(ACTION_TYPES_ALLOW_ORPHANS);
    const unmapped: string[] = [];

    for (const actionType of ACTION_TYPES) {
      const lastDot = actionType.lastIndexOf('.');
      if (lastDot === -1) {
        unmapped.push(actionType);
        continue;
      }

      const entityType = actionType.slice(0, lastDot);
      const verb = actionType.slice(lastDot + 1);

      if (orphanAllowSet.has(actionType)) continue;

      const verbs = handlerMeta.get(entityType);
      if (!verbs || !verbs.includes(verb)) {
        unmapped.push(actionType);
      }
    }

    expect(
      unmapped,
      `ACTION_TYPES entries with no handler and not allowlisted: ${unmapped.join(', ')}. ` +
        'Either add a handler or add to ACTION_TYPES_ALLOW_ORPHANS with a comment.',
    ).toEqual([]);
  });

  it('orphan allowlist entries must actually be orphans', () => {
    const falseOrphans: string[] = [];

    for (const actionType of ACTION_TYPES_ALLOW_ORPHANS) {
      const lastDot = actionType.lastIndexOf('.');
      if (lastDot === -1) continue;

      const entityType = actionType.slice(0, lastDot);
      const verb = actionType.slice(lastDot + 1);

      const verbs = handlerMeta.get(entityType);
      if (verbs && verbs.includes(verb)) {
        falseOrphans.push(actionType);
      }
    }

    expect(
      falseOrphans,
      `Allowlisted orphans that actually have handlers (remove from allowlist): ${falseOrphans.join(', ')}`,
    ).toEqual([]);
  });
});
