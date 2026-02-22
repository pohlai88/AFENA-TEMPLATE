import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * SLA-06 — Preview Mode: Derive Without Posting (What-If)
 *
 * Simulates journal derivation from accounting events without persisting.
 * Returns preview entries for user review before committing.
 * Pure function — no I/O.
 */

export type PreviewEvent = { eventId: string; eventType: string; amountMinor: number; accountDebit: string; accountCredit: string; description: string };

export type PreviewEntry = { eventId: string; debitAccount: string; creditAccount: string; debitMinor: number; creditMinor: number; description: string; isPreview: true };

export type PreviewResult = { entries: PreviewEntry[]; totalDebitMinor: number; totalCreditMinor: number; isBalanced: boolean; eventCount: number };

export function previewDerivation(events: PreviewEvent[]): CalculatorResult<PreviewResult> {
  if (events.length === 0) throw new DomainError('VALIDATION_FAILED', 'No events to preview');
  const entries: PreviewEntry[] = events.map((e) => ({
    eventId: e.eventId, debitAccount: e.accountDebit, creditAccount: e.accountCredit,
    debitMinor: e.amountMinor, creditMinor: e.amountMinor, description: e.description, isPreview: true as const,
  }));
  const totalDebitMinor = entries.reduce((s, e) => s + e.debitMinor, 0);
  const totalCreditMinor = entries.reduce((s, e) => s + e.creditMinor, 0);
  return { result: { entries, totalDebitMinor, totalCreditMinor, isBalanced: totalDebitMinor === totalCreditMinor, eventCount: events.length }, inputs: { eventCount: events.length }, explanation: `Preview: ${entries.length} entries, balanced=${totalDebitMinor === totalCreditMinor}` };
}
