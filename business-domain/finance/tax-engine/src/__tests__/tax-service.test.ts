import type { DomainContext } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { describe, expect, it, vi } from 'vitest';
import { calculateLineTaxForDocument, getTaxRate } from '../services/tax-service';

vi.mock('afenda-database', () => ({
  taxRates: {},
  db: {},
}));

const mockCtx = (): DomainContext =>
  ({
    orgId: 'org-1' as DomainContext['orgId'],
    companyId: 'co-1' as DomainContext['companyId'],
    currency: 'MYR' as DomainContext['currency'],
    actor: { userId: 'user-1' as DomainContext['actor']['userId'], roles: ['accountant'] as DomainContext['actor']['roles'] },
    asOf: '2026-01-01T00:00:00+08:00' as DomainContext['asOf'],
  }) as DomainContext;

function mockDb(rate: string): DbSession {
  return {
    read: vi.fn().mockResolvedValue([{ taxCode: 'GST-6', rate }]),
    ro: vi.fn().mockResolvedValue([{ taxCode: 'GST-6', rate }]),
    rw: vi.fn() as DbSession['rw'],
    query: vi.fn(),
    wrote: false,
  } as unknown as DbSession;
}

function mockDbEmpty(): DbSession {
  return {
    read: vi.fn().mockResolvedValue([]),
    ro: vi.fn().mockResolvedValue([]),
    rw: vi.fn() as DbSession['rw'],
    query: vi.fn(),
    wrote: false,
  } as unknown as DbSession;
}

describe('getTaxRate', () => {
  it('returns read result with tax rate model', async () => {
    const db = mockDb('0.06');
    const result = await getTaxRate(db, mockCtx(), {
      taxCode: 'GST-6',
      effectiveDate: '2026-01-01',
    });
    expect(result.kind).toBe('read');
    if (result.kind === 'read') {
      expect(result.data.taxCode).toBe('GST-6');
      expect(result.data.rate).toBe('0.06');
    }
  });

  it('throws NOT_FOUND when no rate exists', async () => {
    const db = mockDbEmpty();
    await expect(
      getTaxRate(db, mockCtx(), { taxCode: 'UNKNOWN', effectiveDate: '2026-01-01' }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });
});

describe('calculateLineTaxForDocument', () => {
  it('calculates 6% GST on MYR 100.00 (10000 minor)', async () => {
    const db = mockDb('0.06');
    const result = await calculateLineTaxForDocument(db, mockCtx(), {
      baseMinor: 10000,
      taxCode: 'GST-6',
      effectiveDate: '2026-01-01',
    });
    expect(result.kind).toBe('read');
    if (result.kind === 'read') {
      expect(result.data.taxMinor).toBe(600);
      expect(result.data.taxCode).toBe('GST-6');
    }
  });

  it('calculates 9% GST on SGD 50.00 (5000 minor)', async () => {
    const db = mockDb('0.09');
    const result = await calculateLineTaxForDocument(db, mockCtx(), {
      baseMinor: 5000,
      taxCode: 'GST-9',
      effectiveDate: '2026-01-01',
    });
    expect(result.kind).toBe('read');
    if (result.kind === 'read') {
      expect(result.data.taxMinor).toBe(450);
    }
  });

  it('throws NOT_FOUND when tax code does not exist', async () => {
    const db = mockDbEmpty();
    await expect(
      calculateLineTaxForDocument(db, mockCtx(), {
        baseMinor: 10000,
        taxCode: 'MISSING',
        effectiveDate: '2026-01-01',
      }),
    ).rejects.toBeInstanceOf(DomainError);
  });
});
