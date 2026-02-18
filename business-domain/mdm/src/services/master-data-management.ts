import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface MasterDataRecord {
  id: string;
  orgId: string;
  domain: 'CUSTOMER' | 'VENDOR' | 'PRODUCT' | 'LOCATION' | 'EMPLOYEE';
  externalId: string;
  data: Record<string, unknown>;
  version: number;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING_APPROVAL';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DataQualityRule {
  id: string;
  domain: string;
  field: string;
  ruleType: 'REQUIRED' | 'FORMAT' | 'RANGE' | 'UNIQUENESS' | 'REFERENCE';
  ruleConfig: Record<string, unknown>;
  severity: 'ERROR' | 'WARNING';
}

export interface DataQualityIssue {
  id: string;
  recordId: string;
  ruleId: string;
  field: string;
  issueDescription: string;
  severity: 'ERROR' | 'WARNING';
  status: 'OPEN' | 'RESOLVED' | 'IGNORED';
  identifiedAt: Date;
}

export async function createMasterRecord(
  db: NeonHttpDatabase,
  data: Omit<MasterDataRecord, 'id' | 'version' | 'createdAt' | 'updatedAt'>,
): Promise<MasterDataRecord> {
  // TODO: Insert master data record with version 1
  throw new Error('Database integration pending');
}

export async function updateMasterRecord(
  db: NeonHttpDatabase,
  recordId: string,
  updates: Partial<MasterDataRecord['data']>,
  updatedBy: string,
): Promise<MasterDataRecord> {
  // TODO: Update record and increment version
  throw new Error('Database integration pending');
}

export async function validateDataQuality(
  db: NeonHttpDatabase,
  recordId: string,
): Promise<DataQualityIssue[]> {
  // TODO: Run all quality rules against record
  throw new Error('Database integration pending');
}

export async function findDuplicates(
  db: NeonHttpDatabase,
  domain: string,
  matchFields: string[],
): Promise<Array<{ records: MasterDataRecord[]; matchScore: number }>> {
  // TODO: Find potential duplicate records
  throw new Error('Database integration pending');
}

export function applyDataQualityRule(
  record: MasterDataRecord,
  rule: DataQualityRule,
): DataQualityIssue | null {
  const fieldValue = record.data[rule.field];

  if (rule.ruleType === 'REQUIRED' && !fieldValue) {
    return {
      id: '', // Will be generated
      recordId: record.id,
      ruleId: rule.id,
      field: rule.field,
      issueDescription: `Required field ${rule.field} is missing`,
      severity: rule.severity,
      status: 'OPEN',
      identifiedAt: new Date(),
    };
  }

  if (rule.ruleType === 'FORMAT' && fieldValue) {
    const pattern = rule.ruleConfig.pattern as string;
    if (pattern && !new RegExp(pattern).test(String(fieldValue))) {
      return {
        id: '',
        recordId: record.id,
        ruleId: rule.id,
        field: rule.field,
        issueDescription: `Field ${rule.field} does not match required format`,
        severity: rule.severity,
        status: 'OPEN',
        identifiedAt: new Date(),
      };
    }
  }

  return null;
}

export function calculateDataQualityScore(
  totalRecords: number,
  issuesByType: Map<string, number>,
): { score: number; breakdown: Map<string, number> } {
  let totalIssues = 0;
  for (const count of issuesByType.values()) {
    totalIssues += count;
  }

  const score = totalRecords > 0 ? ((totalRecords - totalIssues) / totalRecords) * 100 : 100;

  return { score: Math.max(0, Math.min(100, score)), breakdown: issuesByType };
}

export function matchRecords(
  record1: MasterDataRecord,
  record2: MasterDataRecord,
  matchFields: string[],
): { isMatch: boolean; matchScore: number; matchedFields: string[] } {
  let matchedFields: string[] = [];
  let score = 0;

  for (const field of matchFields) {
    const val1 = String(record1.data[field] || '').toLowerCase();
    const val2 = String(record2.data[field] || '').toLowerCase();

    if (val1 === val2 && val1 !== '') {
      matchedFields.push(field);
      score += 100 / matchFields.length;
    }
  }

  return {
    isMatch: score >= 70, // 70% match threshold
    matchScore: score,
    matchedFields,
  };
}
