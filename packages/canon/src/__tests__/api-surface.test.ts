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
    
    const approvedExports = [
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
    ].sort();
    
    expect(exportedKeys).toEqual(approvedExports);
  });

  it('types exports match approved list', async () => {
    const types = await import('../types/index');
    const exportedKeys = Object.keys(types).sort();
    
    const approvedExports = [
      'ACTION_FAMILIES',
      'ACTION_TYPES',
      'ACTION_VERBS',
      'CAPABILITY_CATALOG',
      'CanonParseError',
      'CanonValidationError',
      'ENTITY_TYPES',
      'ERROR_CODES',
      'RateLimitError',
      'SYSTEM_ACTOR_USER_ID',
      'asAuditLogId',
      'asBatchId',
      'asEntityId',
      'asMutationId',
      'asOrgId',
      'asUserId',
      'createIssue',
      'err',
      'errSingle',
      'extractEntityNamespace',
      'extractVerb',
      'getActionFamily',
      'isAuditLogId',
      'isBatchId',
      'isEntityId',
      'isMutationId',
      'isOrgId',
      'isUserId',
      'ok',
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
  });

  it('mappings exports match approved list', async () => {
    const mappings = await import('../mappings/index');
    const exportedKeys = Object.keys(mappings).sort();
    
    const approvedExports = [
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
    ].sort();
    
    expect(exportedKeys).toEqual(approvedExports);
  });
});
