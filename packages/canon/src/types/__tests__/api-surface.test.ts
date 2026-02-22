/**
 * API Surface Guard Test
 * 
 * Prevents accidental breaking changes by snapshotting the public API surface.
 * This test will fail if exports are added, removed, or renamed.
 */

import { describe, expect, it } from 'vitest';

import * as types from '../index';

describe('API Surface Guard', () => {
  it('should maintain stable API surface for types barrel', () => {
    const exports = Object.keys(types).sort();

    // Snapshot the current API surface
    expect(exports).toMatchInlineSnapshot(`
      [
        "ACTION_FAMILIES",
        "ACTION_FAMILY_TO_TIER",
        "ACTION_TYPES",
        "ACTION_VERBS",
        "CANON_EVENT_NAMES",
        "CANON_ISSUE_CODES",
        "CAPABILITY_CATALOG",
        "CAPABILITY_DOMAINS",
        "CAPABILITY_KEYS",
        "CAPABILITY_KINDS",
        "CAPABILITY_NAMESPACES",
        "CAPABILITY_VERBS",
        "CanonParseError",
        "CanonValidationError",
        "ENTITY_TYPES",
        "ERROR_CODES",
        "KIND_TO_SCOPE",
        "KIND_TO_TIER",
        "LifecycleError",
        "RBAC_SCOPES",
        "RBAC_TIERS",
        "RateLimitError",
        "SYSTEM_ACTOR_USER_ID",
        "VERB_TO_KIND",
        "VIS_POLICY",
        "asAuditLogId",
        "asBatchId",
        "asEntityId",
        "asMutationId",
        "asOrgId",
        "asUserId",
        "assertCanonEventName",
        "createIssue",
        "err",
        "errSingle",
        "extractEntityNamespace",
        "extractVerb",
        "getActionFamily",
        "inferKindFromVerb",
        "isAuditLogId",
        "isBatchId",
        "isEntityId",
        "isMutationId",
        "isOrgId",
        "isUserId",
        "ok",
        "parseCapabilityKey",
        "tryAsAuditLogId",
        "tryAsBatchId",
        "tryAsEntityId",
        "tryAsMutationId",
        "tryAsOrgId",
        "tryAsUserId",
        "validateCapabilityKey",
        "zodErrorToCanonIssues",
      ]
    `);
  });

  it('should maintain stable CanonResult shape', () => {
    const okResult = types.ok({ test: 'value' });
    const errResult = types.err([types.createIssue('TEST', 'Test message')]);

    // Verify ok result shape
    expect(okResult).toHaveProperty('ok', true);
    expect(okResult).toHaveProperty('value');
    expect(Object.keys(okResult).sort()).toEqual(['ok', 'value']);

    // Verify error result shape
    expect(errResult).toHaveProperty('ok', false);
    expect(errResult).toHaveProperty('issues');
    expect(Object.keys(errResult).sort()).toEqual(['issues', 'ok']);
  });

  it('should maintain stable CanonIssue shape', () => {
    const issue = types.createIssue('TEST_CODE', 'Test message', ['field'], { extra: 'data' });

    // Verify issue has expected keys
    expect(Object.keys(issue).sort()).toEqual(['code', 'details', 'message', 'path']);

    // Verify types
    expect(typeof issue.code).toBe('string');
    expect(typeof issue.message).toBe('string');
    expect(Array.isArray(issue.path)).toBe(true);
    expect(typeof issue.details).toBe('object');
  });

  it('should maintain stable branded ID exports', () => {
    const idFunctions = Object.keys(types).filter(key =>
      key.startsWith('is') || key.startsWith('as') || key.startsWith('tryAs')
    ).sort();

    expect(idFunctions).toMatchInlineSnapshot(`
      [
        "asAuditLogId",
        "asBatchId",
        "asEntityId",
        "asMutationId",
        "asOrgId",
        "asUserId",
        "assertCanonEventName",
        "isAuditLogId",
        "isBatchId",
        "isEntityId",
        "isMutationId",
        "isOrgId",
        "isUserId",
        "tryAsAuditLogId",
        "tryAsBatchId",
        "tryAsEntityId",
        "tryAsMutationId",
        "tryAsOrgId",
        "tryAsUserId",
      ]
    `);
  });

  it('should maintain stable capability exports', () => {
    const capabilityExports = Object.keys(types).filter(key =>
      key.includes('CAPABILITY') || key.includes('RBAC') || key.includes('VIS')
    ).sort();

    expect(capabilityExports).toMatchInlineSnapshot(`
      [
        "CAPABILITY_CATALOG",
        "CAPABILITY_DOMAINS",
        "CAPABILITY_KEYS",
        "CAPABILITY_KINDS",
        "CAPABILITY_NAMESPACES",
        "CAPABILITY_VERBS",
        "RBAC_SCOPES",
        "RBAC_TIERS",
        "VIS_POLICY",
      ]
    `);
  });
});
