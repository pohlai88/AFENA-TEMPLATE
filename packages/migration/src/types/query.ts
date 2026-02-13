/**
 * Parameterized query (SQL injection safe)
 */
export interface Query {
  text: string;
  values: unknown[];
}

/**
 * Legacy column key (validated against introspected schema)
 */
export type LegacyColumnKey = string;

/**
 * Legacy filter for queries
 */
export interface LegacyFilter {
  field: LegacyColumnKey;
  operator: '=' | '>' | '<' | '>=' | '<=' | 'IN';
  value: unknown;
}

/**
 * Legacy schema from introspector
 */
export interface LegacySchema {
  tableName: string;
  columns: Array<{ name: string; type: string }>;
}
