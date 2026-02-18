import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface DataCatalog {
  id: string;
  orgId: string;
  datasetName: string;
  description: string;
  dataOwner: string;
  classification: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';
  dataLocation: string;
  schema?: Record<string, unknown>;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DataQualityMetric {
  id: string;
  catalogId: string;
  metricDate: Date;
  completeness: number; // 0-100
  accuracy: number; // 0-100
  consistency: number; // 0-100
  timeliness: number; // 0-100
  overallScore: number; // 0-100
}

export interface DataLineage {
  id: string;
  sourceCatalogId: string;
  targetCatalogId: string;
  transformationType: 'COPY' | 'TRANSFORM' | 'AGGREGATE' | 'JOIN';
  transformationLogic?: string;
  createdAt: Date;
}

export async function registerDataset(
  db: NeonHttpDatabase,
  data: Omit<DataCatalog, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<DataCatalog> {
  // TODO: Insert dataset into catalog
  throw new Error('Database integration pending');
}

export async function recordQualityMetric(
  db: NeonHttpDatabase,
  catalogId: string,
  metrics: Omit<DataQualityMetric, 'id' | 'catalogId' | 'metricDate' | 'overallScore'>,
): Promise<DataQualityMetric> {
  // TODO: Calculate overall score and insert
  throw new Error('Database integration pending');
}

export async function traceLineage(
  db: NeonHttpDatabase,
  catalogId: string,
): Promise<{ upstream: DataCatalog[]; downstream: DataCatalog[] }> {
  // TODO: Trace data lineage upstream and downstream
  throw new Error('Database integration pending');
}

export function calculateDataQualityScore(
  completeness: number,
  accuracy: number,
  consistency: number,
  timeliness: number,
  weights: { completeness: number; accuracy: number; consistency: number; timeliness: number } = {
    completeness: 0.3,
    accuracy: 0.3,
    consistency: 0.2,
    timeliness: 0.2,
  },
): number {
  return (
    completeness * weights.completeness +
    accuracy * weights.accuracy +
    consistency * weights.consistency +
    timeliness * weights.timeliness
  );
}

export function classifyDataSensitivity(
  datasetName: string,
  columnNames: string[],
): 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED' {
  const sensitivePatterns = [
    'ssn', 'social_security', 'tax_id', 'credit_card', 'password',
    'salary', 'bank_account', 'passport', 'drivers_license',
  ];

  const confidentialPatterns = [
    'email', 'phone', 'address', 'dob', 'birth_date', 'personal',
  ];

  for (const col of columnNames) {
    const colLower = col.toLowerCase();
    if (sensitivePatterns.some((pattern) => colLower.includes(pattern))) {
      return 'RESTRICTED';
    }
    if (confidentialPatterns.some((pattern) => colLower.includes(pattern))) {
      return 'CONFIDENTIAL';
    }
  }

  return 'INTERNAL';
}

export function detectDataAnomaly(
  recentMetrics: DataQualityMetric[],
  threshold: number = 20,
): { hasAnomaly: boolean; anomalies: string[] } {
  const anomalies: string[] = [];

  if (recentMetrics.length < 2) return { hasAnomaly: false, anomalies };

  const latest = recentMetrics[recentMetrics.length - 1];
  const previous = recentMetrics[recentMetrics.length - 2];

  if (Math.abs(latest.completeness - previous.completeness) > threshold) {
    anomalies.push(`Completeness dropped by ${(previous.completeness - latest.completeness).toFixed(1)}%`);
  }

  if (Math.abs(latest.accuracy - previous.accuracy) > threshold) {
    anomalies.push(`Accuracy dropped by ${(previous.accuracy - latest.accuracy).toFixed(1)}%`);
  }

  return { hasAnomaly: anomalies.length > 0, anomalies };
}
