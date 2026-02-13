import { describe, it, expect } from 'vitest';

import { ContactsConflictDetector, InvoicesConflictDetector, ProductsConflictDetector } from '../../strategies/conflict-detector.js';

import type { DetectorQueryFn } from '../../strategies/conflict-detector.js';
import type { TransformedRecord } from '../../types/migration-job.js';

describe('ACC-05: Match explanations end-to-end', () => {
  const orgId = 'org-1';

  describe('ContactsConflictDetector', () => {
    const detector = new ContactsConflictDetector();

    const makeQueryFn = (candidates: Array<Record<string, unknown>>): DetectorQueryFn =>
      async () => candidates;

    it('should produce email explanation with score contribution', async () => {
      const records: TransformedRecord[] = [
        { legacyId: 'L1', data: { email: 'alice@example.com', phone: null } },
      ];
      const queryFn = makeQueryFn([
        { id: 'A1', email: 'alice@example.com', phone: null, name: 'Alice' },
      ]);

      const conflicts = await detector.detectBulk(records, { orgId, queryFn });
      expect(conflicts).toHaveLength(1);

      const match = conflicts[0]!.matches[0]!;
      expect(match.explanations).toBeDefined();
      expect(match.explanations).toHaveLength(1);
      expect(match.explanations![0]).toEqual({
        field: 'email',
        matchType: 'normalized',
        scoreContribution: 40,
        legacyValue: 'alice@example.com',
        candidateValue: 'alice@example.com',
      });
      expect(match.score).toBe(40);
    });

    it('should produce both email + phone explanations when both match', async () => {
      const records: TransformedRecord[] = [
        { legacyId: 'L1', data: { email: 'bob@test.com', phone: '+60123456789' } },
      ];
      const queryFn = makeQueryFn([
        { id: 'B1', email: 'bob@test.com', phone: '+60123456789', name: 'Bob' },
      ]);

      const conflicts = await detector.detectBulk(records, { orgId, queryFn });
      expect(conflicts).toHaveLength(1);

      const match = conflicts[0]!.matches[0]!;
      expect(match.explanations).toHaveLength(2);
      expect(match.score).toBe(60);

      const emailExpl = match.explanations!.find(e => e.field === 'email');
      const phoneExpl = match.explanations!.find(e => e.field === 'phone');
      expect(emailExpl!.scoreContribution).toBe(40);
      expect(phoneExpl!.scoreContribution).toBe(20);
      expect(emailExpl!.matchType).toBe('normalized');
      expect(phoneExpl!.matchType).toBe('exact');
    });

    it('should produce phone-only explanation when only phone matches', async () => {
      const records: TransformedRecord[] = [
        { legacyId: 'L1', data: { email: 'different@test.com', phone: '+60111111111' } },
      ];
      const queryFn = makeQueryFn([
        { id: 'C1', email: 'other@test.com', phone: '+60111111111', name: 'Charlie' },
      ]);

      const conflicts = await detector.detectBulk(records, { orgId, queryFn });
      expect(conflicts).toHaveLength(1);

      const match = conflicts[0]!.matches[0]!;
      expect(match.explanations).toHaveLength(1);
      expect(match.explanations![0]!.field).toBe('phone');
      expect(match.score).toBe(20);
    });
  });

  describe('InvoicesConflictDetector', () => {
    const detector = new InvoicesConflictDetector();

    it('should produce invoice number + vendor explanations', async () => {
      const records: TransformedRecord[] = [
        { legacyId: 'L1', data: { invoiceNumber: 'INV-001', vendorId: 'V1' } },
      ];
      const queryFn: DetectorQueryFn = async () => [
        { id: 'I1', invoiceNumber: 'INV-001', vendorId: 'V1' },
      ];

      const conflicts = await detector.detectBulk(records, { orgId, queryFn });
      expect(conflicts).toHaveLength(1);

      const match = conflicts[0]!.matches[0]!;
      expect(match.explanations).toHaveLength(2);
      expect(match.score).toBe(90);

      const invExpl = match.explanations!.find(e => e.field === 'invoiceNumber');
      const vendorExpl = match.explanations!.find(e => e.field === 'vendorId');
      expect(invExpl!.scoreContribution).toBe(50);
      expect(vendorExpl!.scoreContribution).toBe(40);
    });

    it('should produce invoice-only explanation when vendor differs', async () => {
      const records: TransformedRecord[] = [
        { legacyId: 'L1', data: { invoiceNumber: 'INV-002', vendorId: 'V1' } },
      ];
      const queryFn: DetectorQueryFn = async () => [
        { id: 'I2', invoiceNumber: 'INV-002', vendorId: 'V2' },
      ];

      const conflicts = await detector.detectBulk(records, { orgId, queryFn });
      const match = conflicts[0]!.matches[0]!;
      expect(match.explanations).toHaveLength(1);
      expect(match.explanations![0]!.field).toBe('invoiceNumber');
      expect(match.score).toBe(50);
    });
  });

  describe('ProductsConflictDetector', () => {
    const detector = new ProductsConflictDetector();

    it('should produce SKU explanation with 100 score', async () => {
      const records: TransformedRecord[] = [
        { legacyId: 'L1', data: { sku: 'SKU-001', name: 'Widget' } },
      ];
      const queryFn: DetectorQueryFn = async () => [
        { id: 'P1', sku: 'SKU-001', name: 'Widget A' },
      ];

      const conflicts = await detector.detectBulk(records, { orgId, queryFn });
      expect(conflicts).toHaveLength(1);

      const match = conflicts[0]!.matches[0]!;
      expect(match.explanations).toHaveLength(1);
      expect(match.explanations![0]).toEqual({
        field: 'sku',
        matchType: 'exact',
        scoreContribution: 100,
        legacyValue: 'SKU-001',
        candidateValue: 'SKU-001',
      });
      expect(match.score).toBe(100);
    });
  });

  describe('Explanation structure invariants', () => {
    it('should have scoreContribution sum equal to total score', async () => {
      const detector = new ContactsConflictDetector();
      const records: TransformedRecord[] = [
        { legacyId: 'L1', data: { email: 'test@test.com', phone: '+60123456789' } },
      ];
      const queryFn: DetectorQueryFn = async () => [
        { id: 'X1', email: 'test@test.com', phone: '+60123456789', name: 'Test' },
      ];

      const conflicts = await detector.detectBulk(records, { orgId, queryFn });
      const match = conflicts[0]!.matches[0]!;

      const explanationSum = match.explanations!.reduce((sum, e) => sum + e.scoreContribution, 0);
      expect(explanationSum).toBe(match.score);
    });

    it('should have valid matchType values', async () => {
      const detector = new ContactsConflictDetector();
      const records: TransformedRecord[] = [
        { legacyId: 'L1', data: { email: 'a@b.com', phone: '+1234' } },
      ];
      const queryFn: DetectorQueryFn = async () => [
        { id: 'Y1', email: 'a@b.com', phone: '+1234', name: 'Y' },
      ];

      const conflicts = await detector.detectBulk(records, { orgId, queryFn });
      const match = conflicts[0]!.matches[0]!;

      for (const expl of match.explanations!) {
        expect(['exact', 'normalized', 'fuzzy']).toContain(expl.matchType);
      }
    });
  });
});
