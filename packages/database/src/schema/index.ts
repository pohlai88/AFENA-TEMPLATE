export { users } from './users';
export type { User, NewUser } from './users';

export { r2Files } from './r2-files';
export type { R2File, NewR2File } from './r2-files';

export { usersRelations, r2FilesRelations } from './relations';

export { auditLogs } from './audit-logs';
export type { AuditLog, NewAuditLog } from './audit-logs';

export { entityVersions } from './entity-versions';
export type { EntityVersion, NewEntityVersion } from './entity-versions';

export { mutationBatches } from './mutation-batches';
export type { MutationBatch, NewMutationBatch } from './mutation-batches';

export { contacts } from './contacts';
export type { Contact, NewContact } from './contacts';

export { advisories } from './advisories';
export type { Advisory, NewAdvisory } from './advisories';

export { advisoryEvidence } from './advisory-evidence';
export type { AdvisoryEvidence, NewAdvisoryEvidence } from './advisory-evidence';

export { workflowRules } from './workflow-rules';
export type { WorkflowRuleRow, NewWorkflowRuleRow } from './workflow-rules';

export { workflowExecutions } from './workflow-executions';
export type { WorkflowExecution, NewWorkflowExecution } from './workflow-executions';

// ── Phase A: ERP Spine Tables ────────────────────────────
export { companies } from './companies';
export type { Company, NewCompany } from './companies';

export { sites } from './sites';
export type { Site, NewSite } from './sites';

export { currencies } from './currencies';
export type { Currency, NewCurrency } from './currencies';

export { uom } from './uom';
export type { Uom, NewUom } from './uom';

export { uomConversions } from './uom-conversions';
export type { UomConversion, NewUomConversion } from './uom-conversions';

export { numberSequences } from './number-sequences';
export type { NumberSequence, NewNumberSequence } from './number-sequences';

// ── Phase A: Custom Fields ───────────────────────────────
export { customFields } from './custom-fields';
export type { CustomField, NewCustomField } from './custom-fields';

export { customFieldValues } from './custom-field-values';
export type { CustomFieldValue, NewCustomFieldValue } from './custom-field-values';

export { customFieldSyncQueue } from './custom-field-sync-queue';
export type { CustomFieldSyncQueueRow, NewCustomFieldSyncQueueRow } from './custom-field-sync-queue';

// ── Phase A: Entity Views ────────────────────────────────
export { entityViews } from './entity-views';
export type { EntityView, NewEntityView } from './entity-views';

export { entityViewFields } from './entity-view-fields';
export type { EntityViewField, NewEntityViewField } from './entity-view-fields';

// ── Phase A: LiteMetadata ────────────────────────────────
export { metaAssets } from './meta-assets';
export type { MetaAsset, NewMetaAsset } from './meta-assets';

export { metaLineageEdges } from './meta-lineage-edges';
export type { MetaLineageEdge, NewMetaLineageEdge } from './meta-lineage-edges';

export { metaQualityChecks } from './meta-quality-checks';
export type { MetaQualityCheck, NewMetaQualityCheck } from './meta-quality-checks';

// ── Phase A: Aliasing ────────────────────────────────────
export { metaAliasSets } from './meta-alias-sets';
export type { MetaAliasSet, NewMetaAliasSet } from './meta-alias-sets';

export { metaAliases } from './meta-aliases';
export type { MetaAlias, NewMetaAlias } from './meta-aliases';

export { metaAliasResolutionRules } from './meta-alias-resolution-rules';
export type { MetaAliasResolutionRule, NewMetaAliasResolutionRule } from './meta-alias-resolution-rules';

export { metaValueAliases } from './meta-value-aliases';
export type { MetaValueAlias, NewMetaValueAlias } from './meta-value-aliases';

// ── Phase A: Semantic Terms ──────────────────────────────
export { metaSemanticTerms } from './meta-semantic-terms';
export type { MetaSemanticTerm, NewMetaSemanticTerm } from './meta-semantic-terms';

export { metaTermLinks } from './meta-term-links';
export type { MetaTermLink, NewMetaTermLink } from './meta-term-links';

// ── Phase B: Policy Engine ──────────────────────────────
export { roles } from './roles';
export type { Role, NewRole } from './roles';

export { userRoles } from './user-roles';
export type { UserRole, NewUserRole } from './user-roles';

export { rolePermissions } from './role-permissions';
export type { RolePermission, NewRolePermission } from './role-permissions';

export { userScopes } from './user-scopes';
export type { UserScope, NewUserScope } from './user-scopes';

// ── Phase B: Governors ──────────────────────────────────
export { orgUsageDaily } from './org-usage-daily';
export type { OrgUsageDaily, NewOrgUsageDaily } from './org-usage-daily';

// ── Phase B: Trust Hooks (Evidence & Compliance) ────────
export { entityAttachments } from './entity-attachments';
export type { EntityAttachment, NewEntityAttachment } from './entity-attachments';

export { communications } from './communications';
export type { Communication, NewCommunication } from './communications';
