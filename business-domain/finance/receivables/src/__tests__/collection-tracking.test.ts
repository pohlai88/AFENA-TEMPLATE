import { describe, expect, it } from 'vitest';

import { planCollectionActions } from '../calculators/collection-tracking';

describe('AR-06 — Collection action tracking (calls, letters, legal)', () => {
  it('assigns reminder as first action for new overdue invoice', () => {
    const r = planCollectionActions([
      { invoiceId: 'INV-1', customerId: 'C-1', amountMinor: 10_000, dueDateIso: '2025-11-01', daysOverdue: 15, priorActions: [] },
    ]);
    expect(r.result.plans[0]!.nextAction).toBe('reminder');
    expect(r.result.plans[0]!.escalationLevel).toBe(1);
  });

  it('escalates to phone_call after reminder', () => {
    const r = planCollectionActions([
      { invoiceId: 'INV-1', customerId: 'C-1', amountMinor: 10_000, dueDateIso: '2025-11-01', daysOverdue: 35, priorActions: [{ actionType: 'reminder', dateIso: '2025-11-15', notes: '' }] },
    ]);
    expect(r.result.plans[0]!.nextAction).toBe('phone_call');
  });

  it('escalates to legal after formal_letter', () => {
    const r = planCollectionActions([
      { invoiceId: 'INV-1', customerId: 'C-1', amountMinor: 50_000, dueDateIso: '2025-09-01', daysOverdue: 100, priorActions: [
        { actionType: 'reminder', dateIso: '2025-09-15', notes: '' },
        { actionType: 'phone_call', dateIso: '2025-10-01', notes: '' },
        { actionType: 'formal_letter', dateIso: '2025-10-15', notes: '' },
      ] },
    ]);
    expect(r.result.plans[0]!.nextAction).toBe('legal');
    expect(r.result.plans[0]!.priority).toBe('critical');
  });

  it('computes total overdue and critical count', () => {
    const r = planCollectionActions([
      { invoiceId: 'INV-1', customerId: 'C-1', amountMinor: 10_000, dueDateIso: '2025-11-01', daysOverdue: 15, priorActions: [] },
      { invoiceId: 'INV-2', customerId: 'C-2', amountMinor: 20_000, dueDateIso: '2025-08-01', daysOverdue: 120, priorActions: [] },
    ]);
    expect(r.result.totalOverdueMinor).toBe(30_000);
    expect(r.result.criticalCount).toBe(1);
  });

  it('throws on empty invoices', () => {
    expect(() => planCollectionActions([])).toThrow('No overdue');
  });
});
