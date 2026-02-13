import type {
  EntityType,
  MigrationJob,
  MigrationResult,
  FieldMapping,
  FieldMergePolicy,
  SourceConfig,
} from '../types/migration-job.js';
import { hashCanonical } from './canonical-json.js';

/**
 * Signed report with fingerprints for full reproducibility.
 *
 * Nit B: Evidence queries are job-scoped (not org-scoped).
 */
export interface SignedReport {
  jobId: string;
  entityType: EntityType;

  // Source fingerprints
  sourceSchemaFingerprint: string;
  mappingFingerprint: string;
  transformChainFingerprint: string;
  strategyFingerprint: string;

  // Job config
  sourceConfig: SourceConfig;
  fieldMappings: FieldMapping[];
  mergePolicies: FieldMergePolicy[];

  // Registry versions
  registries: {
    conflictStrategies: string[];
    normalizationStrategies: string[];
    dataTypes: string[];
  };

  // Results
  recordsProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsMerged: number;
  recordsSkipped: number;
  recordsFailed: number;
  recordsManualReview: number;

  // Terminal distribution (TERM-01)
  recordsLoaded: number;
  recordsQuarantined: number;

  // Performance summary (GOV-01)
  perfSummary?: Record<string, { count: number; p50: number; p95: number }>;

  // Evidence pointers (job-scoped)
  mergeEvidenceIds: string[];
  manualReviewIds: string[];

  // Metadata
  timestamp: string;
  reportHash: string;
}

export interface ReportInputs {
  job: MigrationJob;
  result: MigrationResult;
  sourceSchemaFingerprint: string;
  transformSteps: Array<{ name: string; order: number }>;
  conflictDetectorName: string;
  conflictDetectorMatchKeys: readonly string[];
  mergeEvidenceIds: string[];
  manualReviewIds: string[];
  recordsLoaded?: number;
  recordsQuarantined?: number;
  perfSummary?: Record<string, { count: number; p50: number; p95: number }>;
}

export function buildSignedReport(inputs: ReportInputs): SignedReport {
  const { job, result } = inputs;

  const mappingFingerprint = hashCanonical(job.fieldMappings);
  const transformChainFingerprint = hashCanonical(inputs.transformSteps);
  const strategyFingerprint = hashCanonical({
    conflictStrategy: job.conflictStrategy,
    mergePolicies: job.mergePolicies,
    detectorName: inputs.conflictDetectorName,
    detectorMatchKeys: inputs.conflictDetectorMatchKeys,
  });

  const reportData = {
    jobId: job.id,
    entityType: job.entityType,
    sourceSchemaFingerprint: inputs.sourceSchemaFingerprint,
    mappingFingerprint,
    transformChainFingerprint,
    strategyFingerprint,
    sourceConfig: job.sourceConfig,
    fieldMappings: job.fieldMappings,
    mergePolicies: job.mergePolicies,
    registries: {
      conflictStrategies: ['skip', 'overwrite', 'merge', 'manual'],
      normalizationStrategies: ['phone_e164_MY', 'phone_e164_US', 'email_lowercase', 'address_normalize', 'whitespace_normalize'],
      dataTypes: ['short_text', 'long_text', 'email', 'phone', 'integer', 'decimal', 'boolean', 'date', 'datetime', 'json', 'uuid'],
    },
    recordsProcessed: result.recordsProcessed,
    recordsCreated: result.recordsCreated,
    recordsUpdated: result.recordsUpdated,
    recordsMerged: result.recordsMerged,
    recordsSkipped: result.recordsSkipped,
    recordsFailed: result.recordsFailed,
    recordsManualReview: result.recordsManualReview,
    recordsLoaded: inputs.recordsLoaded ?? (result.recordsCreated + result.recordsUpdated + result.recordsMerged),
    recordsQuarantined: inputs.recordsQuarantined ?? result.recordsFailed,
    ...(inputs.perfSummary ? { perfSummary: inputs.perfSummary } : {}),
    mergeEvidenceIds: inputs.mergeEvidenceIds,
    manualReviewIds: inputs.manualReviewIds,
    timestamp: new Date().toISOString(),
  };

  const reportHash = hashCanonical(reportData);

  return { ...reportData, reportHash };
}
