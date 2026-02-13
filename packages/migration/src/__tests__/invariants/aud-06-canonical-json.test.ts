import { describe, it, expect } from 'vitest';
import { canonicalStringify, hashCanonical } from '../../audit/canonical-json.js';
import { buildSignedReport } from '../../audit/signed-report.js';
import type { ReportInputs } from '../../audit/signed-report.js';

/**
 * AUD-06: Signed report uses canonical JSON serialization.
 *
 * - Key order doesn't affect hash
 * - Arrays preserve order
 * - Undefined values stripped
 * - Report includes all fingerprints
 */
describe('AUD-06: Canonical JSON hashing', () => {
  it('should produce stable hashes regardless of key order', () => {
    const obj1 = { b: 2, a: 1, c: [3, 2, 1] };
    const obj2 = { a: 1, b: 2, c: [3, 2, 1] };

    const hash1 = hashCanonical(obj1);
    const hash2 = hashCanonical(obj2);

    expect(hash1).toBe(hash2);
  });

  it('should preserve array order', () => {
    const obj1 = { items: [1, 2, 3] };
    const obj2 = { items: [3, 2, 1] };

    const hash1 = hashCanonical(obj1);
    const hash2 = hashCanonical(obj2);

    expect(hash1).not.toBe(hash2);
  });

  it('should strip undefined values', () => {
    const obj1 = { a: 1, b: undefined };
    const obj2 = { a: 1 };

    const str1 = canonicalStringify(obj1);
    const str2 = canonicalStringify(obj2);

    expect(str1).toBe(str2);
  });

  it('should handle nested objects with deep key sorting', () => {
    const obj1 = { z: { b: 2, a: 1 }, a: { d: 4, c: 3 } };
    const obj2 = { a: { c: 3, d: 4 }, z: { a: 1, b: 2 } };

    expect(hashCanonical(obj1)).toBe(hashCanonical(obj2));
  });

  it('should produce deterministic SHA-256 hashes', () => {
    const obj = { test: 'value', num: 42 };
    const hash1 = hashCanonical(obj);
    const hash2 = hashCanonical(obj);

    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64); // SHA-256 hex = 64 chars
  });

  it('should include all fingerprints in signed report', () => {
    const inputs: ReportInputs = {
      job: {
        id: 'job-1',
        orgId: 'org-1',
        entityType: 'contacts',
        sourceConfig: { transport: 'csv', systemName: 'legacy', filePath: '' },
        fieldMappings: [{ sourceField: 'Name', targetField: 'name' }],
        mergePolicies: [],
        conflictStrategy: 'skip',
        status: 'completed',
        checkpointCursor: null,
        recordsSuccess: 10,
        recordsFailed: 0,
      },
      result: {
        recordsProcessed: 10,
        recordsCreated: 8,
        recordsUpdated: 2,
        recordsMerged: 0,
        recordsSkipped: 0,
        recordsFailed: 0,
        recordsManualReview: 0,
      },
      sourceSchemaFingerprint: 'abc123',
      transformSteps: [
        { name: 'trim_whitespace', order: 10 },
        { name: 'type_coercion', order: 100 },
      ],
      conflictDetectorName: 'contacts_email_phone',
      conflictDetectorMatchKeys: ['email', 'phone'],
      mergeEvidenceIds: [],
      manualReviewIds: [],
    };

    const report = buildSignedReport(inputs);

    expect(report.sourceSchemaFingerprint).toBe('abc123');
    expect(report.mappingFingerprint).toBeDefined();
    expect(report.transformChainFingerprint).toBeDefined();
    expect(report.strategyFingerprint).toBeDefined();
    expect(report.reportHash).toBeDefined();
    expect(report.reportHash).toHaveLength(64);

    // Verify determinism
    const report2 = buildSignedReport(inputs);
    expect(report.mappingFingerprint).toBe(report2.mappingFingerprint);
    expect(report.transformChainFingerprint).toBe(report2.transformChainFingerprint);
    expect(report.strategyFingerprint).toBe(report2.strategyFingerprint);
  });
});
