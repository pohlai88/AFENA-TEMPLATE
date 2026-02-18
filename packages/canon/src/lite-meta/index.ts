/**
 * LiteMetadata Barrel Export
 *
 * Pure metadata operations: asset identification, alias resolution, lineage,
 * quality rules, column classification, and glossary types.
 */

// Asset Keys
export {
    ASSET_KEY_PREFIX_SPECS, analyzeAssetKey, assertAssetTypeMatchesKey, buildAssetKey,
    canonicalizeKey, deriveAssetTypeFromKey, parseAssetKey,
    validateAssetKey, type AssetKeyPrefix,
    type ParsedAssetKey
} from './asset-keys';

// Asset Fingerprint
export {
    assetFingerprint,
    descriptorsEqual, type AssetDescriptor
} from './asset-fingerprint';

// Alias Resolution
export {
    ALIAS_SCOPE_SPECIFICITY, matchAlias,
    resolveAlias, slugify, type AliasCandidate,
    type AliasMatch, type AliasTrace, type ResolutionContext, type ResolutionResult, type ResolutionRule
} from './alias-resolution';

// Lineage
export {
    explainLineageEdge, inferEdgeType, topoSortLineage, validateLineageEdge, type LineageEdge
} from './lineage';

// Quality Rules
export {
    DIMENSION_TO_RULES,
    compileQualityRule,
    scoreQualityTier, type QualityCheckResult, type QualityDimension, type QualityPlan, type QualityRule, type QualityRuleType
} from './quality-rules';

// Classification
export {
    PII_PATTERNS,
    classifyColumn,
    classifyColumns, type PIIPattern
} from './classification';

// Glossary
export {
    type GlossaryTerm,
    type TermLink
} from './glossary';

