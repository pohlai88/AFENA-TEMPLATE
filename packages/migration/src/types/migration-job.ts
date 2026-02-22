import type { Cursor } from './cursor.js';

export type EntityType = string;

export type ConflictStrategyName = 'skip' | 'overwrite' | 'merge' | 'manual';

export type SourceTransport = 'sql' | 'csv' | 'api';
export type SqlDialect = 'postgres' | 'mysql' | 'mssql' | 'oracle';

export interface SqlSourceConfig {
  transport: 'sql';
  dialect: SqlDialect;
  systemName: string;
  host: string;
  database: string;
  readOnlyUser: string;
  port?: number;
  ssl?: boolean;
}

export interface CsvSourceConfig {
  transport: 'csv';
  systemName: string;
  filePath: string;
  delimiter?: string;
  encoding?: string;
}

export interface ApiSourceConfig {
  transport: 'api';
  systemName: string;
  baseUrl: string;
}

export type SourceConfig = SqlSourceConfig | CsvSourceConfig | ApiSourceConfig;

export interface FieldMapping {
  sourceField: string;
  targetField: string;
  transform?: string;
}

export interface FieldMergePolicy {
  field: string;
  strategy: 'prefer_legacy' | 'prefer_newest' | 'prefer_non_empty' | 'manual';
}

export interface MigrationJob {
  id: string;
  orgId: string;
  entityType: EntityType;
  sourceConfig: SourceConfig;
  fieldMappings: FieldMapping[];
  mergePolicies: FieldMergePolicy[];
  conflictStrategy: ConflictStrategyName;
  batchSize: number;
  dryRun?: boolean;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'rolled_back';
  checkpointCursor: Cursor;
  recordsSuccess: number;
  recordsFailed: number;
  maxRuntimeMs?: number;
  rateLimit?: number;
}

export interface MigrationContext {
  orgId: string;
  workerId?: string;
  requestId: string;
}

export interface MigrationResult {
  recordsProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsMerged: number;
  recordsSkipped: number;
  recordsFailed: number;
  recordsManualReview: number;
}

export interface LegacyRecord {
  legacyId: string;
  data: Record<string, unknown>;
}

export interface TransformedRecord {
  legacyId: string;
  data: Record<string, unknown>;
}

export interface BatchResult {
  records: LegacyRecord[];
  nextCursor: Cursor;
}

export interface GateResult {
  passed: boolean;
  reason?: string;
}
