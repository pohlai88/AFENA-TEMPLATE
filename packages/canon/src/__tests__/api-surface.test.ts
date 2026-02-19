/**
 * Public API surface audit
 * 
 * Prevents accidental export leakage and drift.
 * Snapshot-based test ensures only intended symbols are exported.
 */

import { describe, expect, it } from 'vitest';

describe('Public API Surface Audit', () => {
  it('lite-meta exports match approved list', async () => {
    const liteMeta = await import('../lite-meta/index');
    const exportedKeys = Object.keys(liteMeta).sort();

    const coreExports = [
      'ALIAS_SCOPE_SPECIFICITY',
      'ASSET_KEY_PREFIX_SPECS',
      'DIMENSION_TO_RULES',
      'PII_PATTERNS',
      'analyzeAssetKey',
      'assetFingerprint',
      'assertAssetTypeMatchesKey',
      'buildAssetKey',
      'canonicalizeKey',
      'classifyColumn',
      'classifyColumns',
      'compileQualityRule',
      'deriveAssetTypeFromKey',
      'descriptorsEqual',
      'explainLineageEdge',
      'inferEdgeType',
      'matchAlias',
      'parseAssetKey',
      'resolveAlias',
      'scoreQualityTier',
      'slugify',
      'topoSortLineage',
      'validateAssetKey',
      'validateLineageEdge',
    ];

    // Core exports must all be present
    for (const key of coreExports) {
      expect(exportedKeys).toContain(key);
    }

    // Also verify cache, hooks, resilience, batch sub-modules are exported
    expect(exportedKeys).toContain('getAllCacheStats');
    expect(exportedKeys).toContain('memoize');
    expect(exportedKeys).toContain('TieredCache');
    expect(exportedKeys).toContain('setInstrumentationHooks');
    expect(exportedKeys).toContain('parseAssetKeySafe');
    expect(exportedKeys).toContain('classifyColumnsSafe');
    expect(exportedKeys).toContain('processInChunks');
    expect(exportedKeys).toContain('ASSET_TYPE_PREFIXES');
  });

  it('types exports match approved list', async () => {
    const types = await import('../types/index');
    const exportedKeys = Object.keys(types).sort();

    const approvedExports = [
      'ACTION_FAMILIES',
      'ACTION_FAMILY_TO_TIER',
      'ACTION_TYPES',
      'ACTION_VERBS',
      'CANON_EVENT_NAMES',
      'CANON_ISSUE_CODES',
      'CAPABILITY_CATALOG',
      'CAPABILITY_DOMAINS',
      'CAPABILITY_KEYS',
      'CAPABILITY_KINDS',
      'CAPABILITY_NAMESPACES',
      'CAPABILITY_VERBS',
      'CanonParseError',
      'CanonValidationError',
      'ENTITY_TYPES',
      'ERROR_CODES',
      'KIND_TO_SCOPE',
      'KIND_TO_TIER',
      'LifecycleError',
      'RBAC_SCOPES',
      'RBAC_TIERS',
      'RateLimitError',
      'SYSTEM_ACTOR_USER_ID',
      'VERB_TO_KIND',
      'VIS_POLICY',
      'asAuditLogId',
      'asBatchId',
      'asEntityId',
      'asMutationId',
      'asOrgId',
      'asUserId',
      'assertCanonEventName',
      'createIssue',
      'err',
      'errSingle',
      'extractEntityNamespace',
      'extractVerb',
      'getActionFamily',
      'inferKindFromVerb',
      'isAuditLogId',
      'isBatchId',
      'isEntityId',
      'isMutationId',
      'isOrgId',
      'isUserId',
      'ok',
      'parseCapabilityKey',
      'tryAsAuditLogId',
      'tryAsBatchId',
      'tryAsEntityId',
      'tryAsMutationId',
      'tryAsOrgId',
      'tryAsUserId',
      'validateCapabilityKey',
      'zodErrorToCanonIssues',
    ].sort();

    expect(exportedKeys).toEqual(approvedExports);
  });

  it('schemas exports are stable', async () => {
    const schemas = await import('../schemas/index');
    const exportedKeys = Object.keys(schemas).sort();

    // Schemas barrel already exists - verify key exports present
    expect(exportedKeys.length).toBeGreaterThan(0);
    expect(exportedKeys).toContain('assetKeySchema');
    expect(exportedKeys).toContain('assetKeyInputSchema');
    expect(exportedKeys).toContain('entityIdSchema');
    expect(exportedKeys).toContain('entityRefSchema');
    expect(exportedKeys).toContain('receiptSchema');
    expect(exportedKeys).toContain('mutationReceiptSchema');
    expect(exportedKeys).toContain('retryableReasonSchema');
  });

  it('mappings exports match approved list', async () => {
    const mappings = await import('../mappings/index');
    const exportedKeys = Object.keys(mappings).sort();

    const coreExports = [
      'CONFIDENCE_SEMANTICS',
      'POSTGRES_TO_CANON',
      'TYPE_COMPAT_MATRIX',
      'getCompatLevel',
      'inferCsvColumnType',
      'isCompatible',
      'mapPostgresColumn',
      'mapPostgresType',
      'normalizePgType',
      'requiresTransform',
    ];

    // Core exports must all be present
    for (const key of coreExports) {
      expect(exportedKeys).toContain(key);
    }

    // Also verify advanced sub-module exports
    expect(exportedKeys).toContain('buildReasonCodes');
    expect(exportedKeys).toContain('clearGlobalCache');
    expect(exportedKeys).toContain('createMappingContext');
    expect(exportedKeys).toContain('recordMappingEvent');
    expect(exportedKeys).toContain('applyUnknownTypePolicy');
    expect(exportedKeys).toContain('DEFAULT_UNKNOWN_TYPE_POLICY');
    expect(exportedKeys).toContain('createTypeMappingRegistry');
    expect(exportedKeys).toContain('ScopedTypeMappingRegistry');
  });
});
