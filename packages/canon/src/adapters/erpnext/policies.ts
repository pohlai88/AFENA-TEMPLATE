/**
 * Adapter policies — applied in Stage 5 (Mapping).
 * Tenancy, money, docstatus, naming, reservedWord.
 */

export const TENANCY_POLICY = {
  /** Always inject org_id on adopted entities */
  injectOrgId: true,
  /** Composite PK (org_id, id) */
  compositePk: ['org_id', 'id'] as const,
} as const;

export const MONEY_POLICY = {
  /** Money fields use bigint minor units */
  type: 'bigint' as const,
};

export const DOCSTATUS_POLICY = {
  /** Map docstatus (0/1/2) to posting_status enum when kind=doc */
  mapTo: 'posting_status' as const,
};

export const NAMING_POLICY = {
  /** entityType: plural slug (sales-orders, video-settings). Doctype "Sales Order" → sales-orders. */
  entityType: 'slug_plural' as const,
  /** tableName: snake_plural (sales_orders, video_settings). Derived from entityType. */
  tableName: 'snake_plural' as const,
  /** fieldName: snake (enable_youtube_tracking) */
  fieldName: 'snake' as const,
};

export const RESERVED_WORD_POLICY = {
  /** Reserved words that must be mapped via dbNameMap */
  words: ['status', 'type', 'from', 'to', 'user'] as const,
  /** Suffix for mapped column names */
  suffix: '_col' as const,
};
