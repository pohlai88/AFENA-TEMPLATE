# afenda Canon (Type Authority) — Architecture Reference

> **Auto-generated** by `afenda readme gen` at 2026-02-22T06:11:18Z. Do not edit — regenerate instead.
> **Package:** `afenda-canon` (`packages/canon`)
> **Purpose:** Single source of truth for all types, schemas, enums, and capability definitions across the monorepo.

---

## 1. Architecture Overview

Canon is the **type authority** package — every other package imports its contracts from here.
It defines the vocabulary of the entire system: entity types, action types, error codes,
capability keys, Zod validation schemas, and RBAC tier mappings.

**Zero runtime dependencies.** Canon is pure TypeScript types + Zod schemas + const objects.
It never imports from any other workspace package.

---

## 2. Key Design Decisions

- **ActionType formula**: `${entityType}.${verb}` — canonical, no exceptions
- **Capability key shapes**: 3 discriminated union shapes (domain.verb, domain.namespace.verb, namespace.verb)
- **Zod v4**: strict mode, `z.record()` requires 2 args, UUID validation is RFC 4122 strict
- **VIS_POLICY**: phase-aware visibility rules encoded as const objects (not runtime config)
- **CAPABILITY_CATALOG**: 26 capabilities with kind, tier, scope, status, entities, risks

---

## 3. Package Structure (live)

| Metric | Value |
| ------ | ----- |
| **Source files** | 172 |
| **Test files** | 42 |
| **Source directories** | domain, enums, lite-meta, mappings, ports, registries, schemas, types, utils, validators |

```
packages/canon/src/
├── domain/
├── enums/
├── lite-meta/
├── mappings/
├── ports/
├── registries/
├── schemas/
├── types/
├── utils/
├── validators/
```

---

## 4. Public API (barrel exports)

### Value Exports

| Export | Source |
| ------ | ------ |
| `ENTITY_TYPES` | `./types/entity` |
| `SYSTEM_ACTOR_USER_ID` | `./types/actor` |
| `LifecycleError` | `./types/lifecycle` |
| `ACTION_FAMILIES` | `./types/action` |
| `ACTION_TYPES` | `./types/action` |
| `ACTION_VERBS` | `./types/action` |
| `extractEntityNamespace` | `./types/action` |
| `extractVerb` | `./types/action` |
| `getActionFamily` | `./types/action` |
| `CANON_EVENT_NAMES` | `./types/events` |
| `assertCanonEventName` | `./types/events` |
| `CanonParseError` | `./types/errors` |
| `CanonValidationError` | `./types/errors` |
| `ERROR_CODES` | `./types/errors` |
| `RateLimitError` | `./types/errors` |
| `ACTION_FAMILY_TO_TIER` | `./types/capability` |
| `CAPABILITY_CATALOG` | `./types/capability` |
| `CAPABILITY_DOMAINS` | `./types/capability` |
| `CAPABILITY_KEYS` | `./types/capability` |
| `CAPABILITY_KINDS` | `./types/capability` |
| `CAPABILITY_NAMESPACES` | `./types/capability` |
| `CAPABILITY_VERBS` | `./types/capability` |
| `KIND_TO_SCOPE` | `./types/capability` |
| `KIND_TO_TIER` | `./types/capability` |
| `RBAC_SCOPES` | `./types/capability` |
| `RBAC_TIERS` | `./types/capability` |
| `VERB_TO_KIND` | `./types/capability` |
| `VIS_POLICY` | `./types/capability` |
| `buildCapabilityKey` | `./types/capability` |
| `getCapabilitiesForEntity` | `./types/capability` |
| `hasCapability` | `./types/capability` |
| `inferKindFromVerb` | `./types/capability` |
| `parseCapabilityKey` | `./types/capability` |
| `resolveCapabilityDescriptor` | `./types/capability` |
| `validateCapabilityKey` | `./types/capability` |
| `asAuditLogId` | `./types/ids` |
| `asBatchId` | `./types/ids` |
| `asEntityId` | `./types/ids` |
| `asMutationId` | `./types/ids` |
| `asOrgId` | `./types/ids` |
| `asUserId` | `./types/ids` |
| `isAuditLogId` | `./types/ids` |
| `isBatchId` | `./types/ids` |
| `isEntityId` | `./types/ids` |
| `isMutationId` | `./types/ids` |
| `isOrgId` | `./types/ids` |
| `isUserId` | `./types/ids` |
| `tryAsAuditLogId` | `./types/ids` |
| `tryAsBatchId` | `./types/ids` |
| `tryAsEntityId` | `./types/ids` |
| `tryAsMutationId` | `./types/ids` |
| `tryAsOrgId` | `./types/ids` |
| `tryAsUserId` | `./types/ids` |
| `CANON_ISSUE_CODES` | `./types/result` |
| `createIssue` | `./types/result` |
| `err` | `./types/result` |
| `errSingle` | `./types/result` |
| `ok` | `./types/result` |
| `zodErrorToCanonIssues` | `./types/result` |
| `actionFamilySchema` | `./schemas/action` |
| `actionTypeSchema` | `./schemas/action` |
| `auditLogEntrySchema` | `./schemas/audit` |
| `capabilityDescriptorSchema` | `./schemas/capability` |
| `capabilityDomainSchema` | `./schemas/capability` |
| `capabilityExceptionSchema` | `./schemas/capability` |
| `capabilityExceptionsFileSchema` | `./schemas/capability` |
| `capabilityKindSchema` | `./schemas/capability` |
| `capabilityNamespaceSchema` | `./schemas/capability` |
| `capabilityRiskSchema` | `./schemas/capability` |
| `capabilityScopeSchema` | `./schemas/capability` |
| `capabilityStatusSchema` | `./schemas/capability` |
| `exceptionScopeSchema` | `./schemas/capability` |
| `rbacScopeSchema` | `./schemas/capability` |
| `rbacTierSchema` | `./schemas/capability` |
| `entityRefSchema` | `./schemas/entity` |
| `entityTypeSchema` | `./schemas/entity` |
| `apiResponseSchema` | `./schemas/envelope` |
| `errorCodeSchema` | `./schemas/errors` |
| `kernelErrorSchema` | `./schemas/errors` |
| `mutationSpecSchema` | `./schemas/mutation` |
| `mutationReceiptSchema` | `./schemas/receipt` |
| `receiptSchema` | `./schemas/receipt` |
| `receiptStatusSchema` | `./schemas/receipt` |
| `retryableReasonSchema` | `./schemas/receipt` |
| `auditLogIdSchema` | `./schemas/branded` |
| `batchIdSchema` | `./schemas/branded` |
| `entityIdSchema` | `./schemas/branded` |
| `mutationIdSchema` | `./schemas/branded` |
| `orgIdSchema` | `./schemas/branded` |
| `userIdSchema` | `./schemas/branded` |
| `createEnumSchema` | `./schemas/helpers` |
| `primitives` | `./schemas/helpers` |
| `withMeta` | `./schemas/helpers` |
| `BoundedLRU` | `./utils/cache` |
| `assetKeyCache` | `./utils/cache` |
| `postgresTypeCache` | `./utils/cache` |
| `typeDerivationCache` | `./utils/cache` |
| `TYPE_CONFIG_SCHEMAS` | `./schemas/data-types` |
| `getTypeConfigSchema` | `./schemas/data-types` |
| `validateTypeConfig` | `./schemas/data-types` |
| `CUSTOM_FIELD_VALIDATORS` | `./validators/presets/custom-field-value` |
| `getFieldValidator` | `./validators/presets/custom-field-value` |
| `validateCustomFieldValue` | `./validators/presets/custom-field-value` |
| `DATA_TYPE_VALUE_COLUMN_MAP` | `./validators/custom-field-value` |
| `validateFieldValue` | `./validators/custom-field-value` |
| `coerceMutationInput` | `./coerce` |
| `CANON_KEYSPACE_VERSION` | `./constants` |
| `CANON_LAYER_RULES` | `./constants` |
| `type CanonLayerKey` | `./constants` |
| `ALIAS_SCOPE_SPECIFICITY` | `./lite-meta/index` |
| `ASSET_KEY_PREFIX_SPECS` | `./lite-meta/index` |
| `DIMENSION_TO_RULES` | `./lite-meta/index` |
| `PII_PATTERNS` | `./lite-meta/index` |
| `analyzeAssetKey` | `./lite-meta/index` |
| `assertAssetTypeMatchesKey` | `./lite-meta/index` |
| `assetFingerprint` | `./lite-meta/index` |
| `buildAssetKey` | `./lite-meta/index` |
| `canonicalizeKey` | `./lite-meta/index` |
| `classifyColumn` | `./lite-meta/index` |
| `classifyColumns` | `./lite-meta/index` |
| `compileQualityRule` | `./lite-meta/index` |
| `deriveAssetTypeFromKey` | `./lite-meta/index` |
| `descriptorsEqual` | `./lite-meta/index` |
| `explainLineageEdge` | `./lite-meta/index` |
| `inferEdgeType` | `./lite-meta/index` |
| `matchAlias` | `./lite-meta/index` |
| `parseAssetKey` | `./lite-meta/index` |
| `resolveAlias` | `./lite-meta/index` |
| `scoreQualityTier` | `./lite-meta/index` |
| `slugify` | `./lite-meta/index` |
| `topoSortLineage` | `./lite-meta/index` |
| `validateAssetKey` | `./lite-meta/index` |
| `validateLineageEdge` | `./lite-meta/index` |
| `// Alias Resolution
  type AliasCandidate` | `./lite-meta/index` |
| `type AliasMatch` | `./lite-meta/index` |
| `type AliasTrace` | `./lite-meta/index` |
| `// Asset Fingerprint
  type AssetDescriptor` | `./lite-meta/index` |
| `// Asset Keys
  type AssetKeyPrefix` | `./lite-meta/index` |
| `// Glossary
  type GlossaryTerm` | `./lite-meta/index` |
| `// Lineage
  type LineageEdge` | `./lite-meta/index` |
| `// Classification
  type PIIPattern` | `./lite-meta/index` |
| `type ParsedAssetKey` | `./lite-meta/index` |
| `type QualityCheckResult` | `./lite-meta/index` |
| `type QualityDimension` | `./lite-meta/index` |
| `type QualityPlan` | `./lite-meta/index` |
| `type QualityRule` | `./lite-meta/index` |
| `// Quality Rules
  type QualityRuleType` | `./lite-meta/index` |
| `type ResolutionContext` | `./lite-meta/index` |
| `type ResolutionResult` | `./lite-meta/index` |
| `type ResolutionRule` | `./lite-meta/index` |
| `type TermLink` | `./lite-meta/index` |
| `CONFIDENCE_SEMANTICS` | `./mappings/index` |
| `// Postgres Types
  POSTGRES_TO_CANON` | `./mappings/index` |
| `TYPE_COMPAT_MATRIX` | `./mappings/index` |
| `getCompatLevel` | `./mappings/index` |
| `// CSV Type Inference
  inferCsvColumnType` | `./mappings/index` |
| `isCompatible` | `./mappings/index` |
| `mapPostgresColumn` | `./mappings/index` |
| `mapPostgresType` | `./mappings/index` |
| `normalizePgType` | `./mappings/index` |
| `requiresTransform` | `./mappings/index` |
| `// Type Compatibility
  type CompatLevel` | `./mappings/index` |
| `type MapPostgresColumnInput` | `./mappings/index` |
| `type MapPostgresColumnOutput` | `./mappings/index` |
| `ENTITY_CONTRACTS` | `./registries/index` |
| `// Entity Registry - Built and validated
  ENTITY_CONTRACT_BUILD_EVENTS` | `./registries/index` |
| `ENTITY_CONTRACT_REGISTRY` | `./registries/index` |
| `ENTITY_CONTRACT_VALIDATION_REPORT` | `./registries/index` |
| `// Errors
  EntityContractRegistryError` | `./registries/index` |
| `// Entity Contract Registry - Types and functions
  buildEntityContractRegistry` | `./registries/index` |
| `// Entity Contracts Data
  companiesContract` | `./registries/index` |
| `contactsContract` | `./registries/index` |
| `costCentersContract` | `./registries/index` |
| `currenciesContract` | `./registries/index` |
| `customersContract` | `./registries/index` |
| `// Utilities
  deepFreeze` | `./registries/index` |
| `deliveryNotesContract` | `./registries/index` |
| `employeesContract` | `./registries/index` |
| `// Validation
  entityContractSchema` | `./registries/index` |
| `findByLabel` | `./registries/index` |
| `findByVerb` | `./registries/index` |
| `findContracts` | `./registries/index` |
| `findWithLifecycle` | `./registries/index` |
| `findWithSoftDelete` | `./registries/index` |
| `getContract` | `./registries/index` |
| `getSize` | `./registries/index` |
| `goodsReceiptsContract` | `./registries/index` |
| `hasContract` | `./registries/index` |
| `invoicesContract` | `./registries/index` |
| `journalEntriesContract` | `./registries/index` |
| `lifecycleTransitionSchema` | `./registries/index` |
| `listContracts` | `./registries/index` |
| `paymentTermsContract` | `./registries/index` |
| `paymentsContract` | `./registries/index` |
| `productsContract` | `./registries/index` |
| `projectsContract` | `./registries/index` |
| `purchaseInvoicesContract` | `./registries/index` |
| `purchaseOrdersContract` | `./registries/index` |
| `quotationsContract` | `./registries/index` |
| `salesOrdersContract` | `./registries/index` |
| `sitesContract` | `./registries/index` |
| `suppliersContract` | `./registries/index` |
| `taxCodesContract` | `./registries/index` |
| `uomContract` | `./registries/index` |
| `validateLifecycleGraph` | `./registries/index` |
| `warehousesContract` | `./registries/index` |
| `type BuildOptions` | `./registries/index` |
| `type EntityContractMap` | `./registries/index` |
| `type RegistryBuildResult` | `./registries/index` |
| `type RegistryEvent` | `./registries/index` |
| `type ValidationIssue` | `./registries/index` |
| `type ValidationReport` | `./registries/index` |
| `type ValidationSeverity` | `./registries/index` |
| `assetDescriptorSchema` | `./schemas/lite-meta` |
| `assetKeyInputSchema` | `./schemas/lite-meta` |
| `assetKeySchema` | `./schemas/lite-meta` |
| `parsedAssetKeySchema` | `./schemas/lite-meta` |
| `qualityDimensionSchema` | `./schemas/lite-meta` |
| `qualityRuleSchema` | `./schemas/lite-meta` |
| `qualityRuleTypeSchema` | `./schemas/lite-meta` |
| `jsonValueSchema` | `./schemas/json-value` |
| `CANON_SCHEMAS` | `./schemas/catalog` |
| `CANON_SCHEMA_BY_CATEGORY` | `./schemas/catalog` |
| `CANON_SCHEMA_MAP` | `./schemas/catalog` |
| `findSchemas` | `./schemas/catalog/discovery` |
| `getSchema` | `./schemas/catalog/discovery` |
| `getSchemaMeta` | `./schemas/catalog/discovery` |
| `getSchemasByCategory` | `./schemas/catalog/discovery` |
| `hasSchema` | `./schemas/catalog/discovery` |
| `listSchemas` | `./schemas/catalog/discovery` |
| `extractOpenApiSeeds` | `./schemas/catalog/openapi` |
| `getOpenApiSeed` | `./schemas/catalog/openapi` |
| `SchemaBuilder` | `./schemas/builders` |
| `createSchemaBuilder` | `./schemas/builders` |
| `clearSchemaCache` | `./schemas/cache` |
| `getSchemaCacheStats` | `./schemas/cache` |
| `memoizeSchema` | `./schemas/cache` |
| `SCHEMA_ERROR_CODES` | `./schemas/error-codes` |
| `isSchemaErrorCode` | `./schemas/error-codes` |
| `commonFields` | `./schemas/fields` |
| `SchemaValidationError` | `./schemas/safe-parse` |
| `parseOrThrow` | `./schemas/safe-parse` |
| `safeParse` | `./schemas/safe-parse` |
| `VAL_CODES` | `./validators/core/codes` |
| `isValidationCode` | `./validators/core/codes` |
| `CompanyIdSchema` | `./types/branded` |
| `CurrencyCodeSchema` | `./types/branded` |
| `FiscalPeriodKeySchema` | `./types/branded` |
| `IndustryOverlayKeySchema` | `./types/branded` |
| `IsoDateTimeSchema` | `./types/branded` |
| `LedgerIdSchema` | `./types/branded` |
| `RoleKeySchema` | `./types/branded` |
| `SiteIdSchema` | `./types/branded` |
| `asCompanyId` | `./types/branded` |
| `asFiscalPeriodKey` | `./types/branded` |
| `asLedgerId` | `./types/branded` |
| `asSiteId` | `./types/branded` |
| `isCompanyId` | `./types/branded` |
| `isFiscalPeriodKey` | `./types/branded` |
| `isLedgerId` | `./types/branded` |
| `isSiteId` | `./types/branded` |
| `parseCompanyId` | `./types/branded` |
| `parseFiscalPeriodKey` | `./types/branded` |
| `parseLedgerId` | `./types/branded` |
| `parseSiteId` | `./types/branded` |
| `DomainError` | `./types/domain-error` |
| `resolveIndustryOverlays` | `./types/industry-overlay` |
| `FINANCE_AUDIT_REGISTRY` | `./registries/finance/finance-audit-registry` |
| `SHARED_KERNEL_REGISTRY` | `./registries/shared-kernel-registry` |
| `DOMAIN_INTENT_REGISTRY` | `./registries/domain-intent-registry` |
| `OVERLAY_DEPENDENCY_GRAPH` | `./registries/overlay-activation` |
| `resolveActiveOverlays` | `./registries/overlay-activation` |
| `DOMAIN_PACKAGE_COUNT` | `./registries/domain-taxonomy` |
| `INTENT_COUNT` | `./registries/domain-taxonomy` |
| `stableCanonicalJson` | `./utils/stable-json` |

### Type Exports

| Type | Source |
| ---- | ------ |
| `BaseEntity` | `./types/entity` |
| `EntityRef` | `./types/entity` |
| `EntityType` | `./types/entity` |
| `ActorRef` | `./types/actor` |
| `AuthoritySnapshotV2` | `./types/policy` |
| `FieldRules` | `./types/policy` |
| `PermissionVerb` | `./types/policy` |
| `PolicyDecision` | `./types/policy` |
| `PolicyDenyReason` | `./types/policy` |
| `ResolvedActor` | `./types/policy` |
| `ResolvedPermission` | `./types/policy` |
| `UserScopeAssignment` | `./types/policy` |
| `LifecycleDenyReason` | `./types/lifecycle` |
| `ActionFamily` | `./types/action` |
| `ActionType` | `./types/action` |
| `ActionVerb` | `./types/action` |
| `ActionEnvelope` | `./types/action-spec` |
| `ActionGroup` | `./types/action-spec` |
| `ActionKind` | `./types/action-spec` |
| `ResolvedAction` | `./types/action-spec` |
| `ResolvedActions` | `./types/action-spec` |
| `ResolvedUpdateMode` | `./types/action-spec` |
| `EntityContract` | `./types/entity-contract` |
| `FieldWriteRules` | `./types/entity-contract` |
| `LifecycleTransition` | `./types/entity-contract` |
| `JsonValue` | `./types/mutation` |
| `MutationPlan` | `./types/mutation` |
| `MutationSpec` | `./types/mutation` |
| `MutationReceipt` | `./types/receipt` |
| `MutationReceiptError` | `./types/receipt` |
| `MutationReceiptOk` | `./types/receipt` |
| `MutationReceiptRejected` | `./types/receipt` |
| `ReceiptStatus` | `./types/receipt` |
| `ApiResponse` | `./types/envelope` |
| `CanonEventName` | `./types/events` |
| `OutboxIntent` | `./types/events` |
| `ErrorCode` | `./types/errors` |
| `KernelError` | `./types/errors` |
| `RetryableReason` | `./types/errors` |
| `AuditLogEntry` | `./types/audit` |
| `CapabilityDescriptor` | `./types/capability` |
| `CapabilityDomain` | `./types/capability` |
| `CapabilityKey` | `./types/capability` |
| `CapabilityKind` | `./types/capability` |
| `CapabilityNamespace` | `./types/capability` |
| `CapabilityRisk` | `./types/capability` |
| `CapabilityScope` | `./types/capability` |
| `CapabilityStatus` | `./types/capability` |
| `ParsedCapabilityKey` | `./types/capability` |
| `RbacScope` | `./types/capability` |
| `RbacTier` | `./types/capability` |
| `VisPolicy` | `./types/capability` |
| `AssetKey` | `./types/ids` |
| `AuditLogId` | `./types/ids` |
| `BatchId` | `./types/ids` |
| `EntityId` | `./types/ids` |
| `MutationId` | `./types/ids` |
| `OrgId` | `./types/ids` |
| `UserId` | `./types/ids` |
| `CanonIssue` | `./types/result` |
| `CanonIssueCode` | `./types/result` |
| `CanonResult` | `./types/result` |
| `WellKnownIssueCode` | `./types/result` |
| `CapabilityException` | `./schemas/capability` |
| `ExceptionScope` | `./schemas/capability` |
| `TypeConfigSchemas` | `./schemas/data-types` |
| `OpenApiSchemaSeed` | `./schemas/catalog/openapi` |
| `CanonSchemaItem` | `./schemas/catalog/types` |
| `OpenApiSeed` | `./schemas/catalog/types` |
| `SchemaCategory` | `./schemas/catalog/types` |
| `SchemaFilters` | `./schemas/catalog/types` |
| `SchemaId` | `./schemas/catalog/types` |
| `SchemaMeta` | `./schemas/catalog/types` |
| `SchemaTag` | `./schemas/catalog/types` |
| `SchemaErrorCode` | `./schemas/error-codes` |
| `ParseResult` | `./schemas/safe-parse` |
| `ValidationCode` | `./validators/core/codes` |
| `NormalizingValidator` | `./validators/core/types` |
| `ValidationContext` | `./validators/core/types` |
| `ValidationResult` | `./validators/core/types` |
| `Validator` | `./validators/core/types` |
| `ValidatorIssue` | `./validators/core/types` |
| `ValidatorSeverity` | `./validators/core/types` |
| `Brand` | `./types/branded` |
| `CompanyId` | `./types/branded` |
| `CurrencyCode` | `./types/branded` |
| `FiscalPeriodKey` | `./types/branded` |
| `IndustryOverlayKey` | `./types/branded` |
| `IsoDateTime` | `./types/branded` |
| `LedgerId` | `./types/branded` |
| `RoleKey` | `./types/branded` |
| `SiteId` | `./types/branded` |
| `DomainContext` | `./types/domain-context` |
| `DomainErrorCode` | `./types/domain-error` |
| `AccrualPostPayload` | `./types/domain-intent` |
| `AcctDeriveCommitPayload` | `./types/domain-intent` |
| `AcctMappingPublishPayload` | `./types/domain-intent` |
| `AssetDepreciatePayload` | `./types/domain-intent` |
| `AssetDisposePayload` | `./types/domain-intent` |
| `AssetRevaluePayload` | `./types/domain-intent` |
| `BankReconConfirmPayload` | `./types/domain-intent` |
| `BioAssetHarvestPayload` | `./types/domain-intent` |
| `BioAssetMeasurePayload` | `./types/domain-intent` |
| `BorrowCostCapitalisePayload` | `./types/domain-intent` |
| `BorrowCostCeasePayload` | `./types/domain-intent` |
| `BudgetCommitPayload` | `./types/domain-intent` |
| `CloseAdjustmentPostPayload` | `./types/domain-intent` |
| `CloseLockHardPayload` | `./types/domain-intent` |
| `CloseRunFinalizePayload` | `./types/domain-intent` |
| `CloseTaskCompletePayload` | `./types/domain-intent` |
| `ConsolidationEliminatePayload` | `./types/domain-intent` |
| `ConsolidationTranslatePayload` | `./types/domain-intent` |
| `CostAllocatePayload` | `./types/domain-intent` |
| `CreditLimitUpdatePayload` | `./types/domain-intent` |
| `DeferredTaxCalculatePayload` | `./types/domain-intent` |
| `DeferredTaxRecognisePayload` | `./types/domain-intent` |
| `DomainIntent` | `./types/domain-intent` |
| `DunningRunCreatePayload` | `./types/domain-intent` |
| `EmpBenefitAccruePayload` | `./types/domain-intent` |
| `EmpBenefitRemeasurePayload` | `./types/domain-intent` |
| `ExpenseReimbursePayload` | `./types/domain-intent` |
| `FiEirAccrualPayload` | `./types/domain-intent` |
| `FiFvChangePayload` | `./types/domain-intent` |
| `FxHedgeDesignatePayload` | `./types/domain-intent` |
| `FxRevaluePayload` | `./types/domain-intent` |
| `GlAccrualRunPayload` | `./types/domain-intent` |
| `GlAllocationRunPayload` | `./types/domain-intent` |
| `GlCoaPublishPayload` | `./types/domain-intent` |
| `GlPeriodClosePayload` | `./types/domain-intent` |
| `GlPeriodOpenPayload` | `./types/domain-intent` |
| `GlReclassRunPayload` | `./types/domain-intent` |
| `GrantAmortisePayload` | `./types/domain-intent` |
| `GrantRecognisePayload` | `./types/domain-intent` |
| `HedgeDesignatePayload` | `./types/domain-intent` |
| `HedgeEffectivenessPayload` | `./types/domain-intent` |
| `HedgeOciReclassPayload` | `./types/domain-intent` |
| `IcEliminatePayload` | `./types/domain-intent` |
| `IcMatchPayload` | `./types/domain-intent` |
| `IcMirrorPayload` | `./types/domain-intent` |
| `IcNetPayload` | `./types/domain-intent` |
| `ImpairmentRecognisePayload` | `./types/domain-intent` |
| `ImpairmentReversePayload` | `./types/domain-intent` |
| `ImpairmentTestPayload` | `./types/domain-intent` |
| `IntangibleAmortisePayload` | `./types/domain-intent` |
| `IntangibleCapitalisePayload` | `./types/domain-intent` |
| `IntangibleImpairPayload` | `./types/domain-intent` |
| `IntentType` | `./types/domain-intent` |
| `InvPropertyMeasurePayload` | `./types/domain-intent` |
| `InvPropertyTransferPayload` | `./types/domain-intent` |
| `InventoryCostingPayload` | `./types/domain-intent` |
| `InventoryNrvAdjustPayload` | `./types/domain-intent` |
| `JournalPostPayload` | `./types/domain-intent` |
| `JournalReversePayload` | `./types/domain-intent` |
| `LeaseAmortizePayload` | `./types/domain-intent` |
| `LeaseModifyPayload` | `./types/domain-intent` |
| `PayablesInvoiceApprovePayload` | `./types/domain-intent` |
| `PayablesInvoicePostPayload` | `./types/domain-intent` |
| `PayablesPayPayload` | `./types/domain-intent` |
| `PayablesPaymentApprovePayload` | `./types/domain-intent` |
| `PaymentCreatePayload` | `./types/domain-intent` |
| `ProjectCostPayload` | `./types/domain-intent` |
| `ProvisionRecognisePayload` | `./types/domain-intent` |
| `ProvisionReversePayload` | `./types/domain-intent` |
| `ProvisionUtilisePayload` | `./types/domain-intent` |
| `ReceivablesAllocatePayload` | `./types/domain-intent` |
| `ReceivablesInvoicePostPayload` | `./types/domain-intent` |
| `RevenueDeferPayload` | `./types/domain-intent` |
| `RevenueRecognizePayload` | `./types/domain-intent` |
| `SbpExpensePayload` | `./types/domain-intent` |
| `SbpGrantPayload` | `./types/domain-intent` |
| `SbpVestPayload` | `./types/domain-intent` |
| `StockAdjustPayload` | `./types/domain-intent` |
| `SubscriptionInvoicePayload` | `./types/domain-intent` |
| `TaxAdjustPayload` | `./types/domain-intent` |
| `TpPolicyPublishPayload` | `./types/domain-intent` |
| `TpPriceComputePayload` | `./types/domain-intent` |
| `TreasuryTransferPayload` | `./types/domain-intent` |
| `WhtCertificateIssuePayload` | `./types/domain-intent` |
| `WhtRemitPayload` | `./types/domain-intent` |
| `CalculatorResult` | `./types/calculator-result` |
| `AccountingEvent` | `./types/domain-event` |
| `DomainEvent` | `./types/domain-event` |
| `DomainResult` | `./types/domain-result` |
| `KnownOverlay` | `./types/industry-overlay` |
| `ApiKind` | `./types/finance-audit` |
| `CapabilitySection` | `./types/finance-audit` |
| `EvidenceKind` | `./types/finance-audit` |
| `FinanceAuditRegistry` | `./types/finance-audit` |
| `ReportKind` | `./types/finance-audit` |
| `Requirement` | `./types/finance-audit` |
| `Scope` | `./types/finance-audit` |
| `Severity` | `./types/finance-audit` |
| `TestKind` | `./types/finance-audit` |
| `Weight` | `./types/finance-audit` |
| `IdempotencyPolicy` | `./registries/shared-kernel-registry` |
| `PiiLevel` | `./registries/shared-kernel-registry` |
| `SharedKernelEntry` | `./registries/shared-kernel-registry` |
| `SharedKernelTableKey` | `./registries/shared-kernel-registry` |
| `TableKind` | `./registries/shared-kernel-registry` |
| `WriteSurface` | `./registries/shared-kernel-registry` |
| `AccountingReadPort` | `./ports/index` |
| `DocumentNumberPort` | `./ports/index` |
| `FxRateInfo` | `./ports/index` |
| `FxRatePort` | `./ports/index` |
| `FxRateType` | `./ports/index` |
| `JournalEntrySummary` | `./ports/index` |
| `LedgerControlPort` | `./ports/index` |
| `LedgerInfo` | `./ports/index` |
| `NumberSequenceInfo` | `./ports/index` |
| `PartyAddress` | `./ports/index` |
| `PartyInfo` | `./ports/index` |
| `PartyMasterPort` | `./ports/index` |
| `PartyType` | `./ports/index` |
| `PeriodInfo` | `./ports/index` |
| `PeriodStatus` | `./ports/index` |
| `TaxRateInfo` | `./ports/index` |
| `TaxRatePort` | `./ports/index` |
| `TaxType` | `./ports/index` |
| `TrialBalanceRow` | `./ports/index` |

---

## 5. Dependencies

### Internal (workspace)

- `afenda-eslint-config`
- `afenda-typescript-config`

### External

| Package | Version |
| ------- | ------- |
| `lru-cache` | `catalog:` |
| `zod` | `catalog:` |

---

## 6. Invariants

- `K-04`
- `K-06`
- `K-07`
- `K-09`
- `K-10`
- `K-12`
- `K-15`

---

## Design Patterns Detected

- **Builder**
- **Factory**
- **Registry**

---

## Cross-References

- [`crud.architecture.md`](./crud.architecture.md)
- [`business.logic.architecture.md`](./business.logic.architecture.md)
