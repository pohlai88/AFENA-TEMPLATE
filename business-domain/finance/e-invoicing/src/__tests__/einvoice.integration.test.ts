import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { beforeAll, expect, it } from 'vitest';
import { describeIntegration, mockDbSession, testCtx } from '../../../test-utils/integration-helper';
import { issueEInvoice, submitEInvoice, recordClearance } from '../services/einvoice-service';

describeIntegration('E-Invoicing — Integration', () => {
  let db: DbSession;
  let ctx: DomainContext;

  beforeAll(() => {
    db = mockDbSession();
    ctx = testCtx();
  });

  it('issueEInvoice with compliant Peppol invoice returns intent', async () => {
    const result = await issueEInvoice(ctx, {
      invoiceId: 'EINV-INT-001',
      format: 'peppol-bis',
      recipientId: 'RCPT-001',
      currency: 'MYR',
      issueDate: '2026-01-15',
      lines: [
        {
          lineNo: 1,
          description: 'Consulting services',
          quantityMinor: 10,
          unitPriceMinor: 50000,
          taxCode: 'S',
          taxRate: 0.06,
          taxAmountMinor: 30000,
        },
      ],
      hasPaymentMeans: true,
      hasBuyerReference: true,
      sellerTaxId: 'MY-1234567890',
    });
    expect(result.kind).toBe('intent');
    if (result.kind === 'intent') {
      expect(result.intents).toHaveLength(1);
      expect(result.intents[0]!.type).toBe('einvoice.issue');
    }
  });

  it('issueEInvoice with non-compliant invoice returns read with violations', async () => {
    const result = await issueEInvoice(ctx, {
      invoiceId: 'EINV-INT-002',
      format: 'peppol-bis',
      recipientId: 'RCPT-002',
      currency: 'MYR',
      issueDate: '2026-01-15',
      lines: [
        {
          lineNo: 1,
          description: 'Widget',
          quantityMinor: 5,
          unitPriceMinor: 10000,
          taxCode: 'S',
          taxRate: 0.06,
          taxAmountMinor: 3000,
        },
      ],
      hasPaymentMeans: false,
      hasBuyerReference: false,
      sellerTaxId: '',
    });
    expect(result.kind).toBe('read');
    if (result.kind === 'read') {
      expect(result.data.issued).toBe(false);
      expect(result.data.violations.length).toBeGreaterThan(0);
    }
  });

  it('submitEInvoice returns intent with submission details', async () => {
    const result = await submitEInvoice(ctx, {
      invoiceId: 'EINV-INT-001',
      submissionId: 'SUB-001',
      accessPoint: 'https://peppol.example.com/as4',
      submittedAt: '2026-01-15T10:00:00Z',
    });
    expect(result.kind).toBe('intent');
    if (result.kind === 'intent') {
      expect(result.intents).toHaveLength(1);
      expect(result.intents[0]!.type).toBe('einvoice.submit');
    }
  });

  it('recordClearance with cleared status returns intent', async () => {
    const result = await recordClearance(ctx, {
      invoiceId: 'EINV-INT-001',
      submissionId: 'SUB-001',
      clearanceStatus: 'cleared',
      clearedAt: '2026-01-15T10:05:00Z',
    });
    expect(result.kind).toBe('intent');
    if (result.kind === 'intent') {
      expect(result.intents).toHaveLength(1);
      expect(result.intents[0]!.type).toBe('einvoice.clear');
    }
  });

  it('recordClearance with rejected status includes validation errors', async () => {
    const result = await recordClearance(ctx, {
      invoiceId: 'EINV-INT-003',
      submissionId: 'SUB-003',
      clearanceStatus: 'rejected',
      validationErrors: ['BT-29: Seller tax ID missing', 'BT-46: Buyer reference required'],
    });
    expect(result.kind).toBe('intent');
    if (result.kind === 'intent') {
      const payload = result.intents[0]!.payload as { clearanceStatus: string; validationErrors?: string[] };
      expect(payload.clearanceStatus).toBe('rejected');
      expect(payload.validationErrors).toHaveLength(2);
    }
  });
});
