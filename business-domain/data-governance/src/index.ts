/**
 * Data Governance - Public API
 */

export { classifyData, type ClassificationResult, type FieldClassification } from './services/data-classifier';
export { monitorDataQuality, type DataQualityResult } from './services/data-quality-monitor';
export { traceLineage, type LineageEdge, type LineageGraph, type LineageNode } from './services/lineage-tracer';
export { createGoldenRecord, type GoldenRecordResult } from './services/master-data-steward';
export { registerMetadata, searchMetadata, type MetadataEntry, type SearchResult } from './services/metadata-manager';
export { processErasureRequest, setRetentionPolicy, type ErasureResult, type RetentionPolicyResult } from './services/retention-manager';

