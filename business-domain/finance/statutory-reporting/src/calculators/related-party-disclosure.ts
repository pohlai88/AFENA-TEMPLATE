import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see FC-06 — Balance sheet (IAS 1 §54 line items)
 * @see SR-01 — Balance sheet per IAS 1 §54 minimum line items
 * SR-07 — Related Party Disclosures (IAS 24)
 *
 * Collects related-party transactions and formats disclosure notes with
 * required IAS 24 categories: key management compensation, parent/subsidiary
 * transactions, associate transactions, and other related parties.
 * Pure function — no I/O.
 */

export type RelatedPartyTransaction = {
  transactionId: string;
  relatedPartyName: string;
  relationship: 'parent' | 'subsidiary' | 'associate' | 'joint-venture' | 'key-management' | 'other';
  transactionType: string;
  amountMinor: number;
  outstandingBalanceMinor: number;
};

export type KeyManagementCompensation = {
  category: 'short-term-benefits' | 'post-employment' | 'other-long-term' | 'termination' | 'share-based';
  amountMinor: number;
};

export type RelatedPartyInput = {
  reportingEntityName: string;
  fiscalYear: string;
  parentEntityName: string;
  ultimateParentName: string;
  transactions: RelatedPartyTransaction[];
  keyManagementCompensation: KeyManagementCompensation[];
};

export type DisclosureCategory = {
  relationship: string;
  transactionCount: number;
  totalAmountMinor: number;
  totalOutstandingMinor: number;
  transactions: { partyName: string; type: string; amountMinor: number; outstandingMinor: number }[];
};

export type RelatedPartyResult = {
  entityName: string;
  fiscalYear: string;
  parentEntity: string;
  ultimateParent: string;
  categories: DisclosureCategory[];
  totalKeyManagementCompMinor: number;
  keyManagementBreakdown: { category: string; amountMinor: number }[];
  totalTransactionCount: number;
  totalTransactionValueMinor: number;
};

export function generateRelatedPartyDisclosure(input: RelatedPartyInput): CalculatorResult<RelatedPartyResult> {
  const { reportingEntityName, fiscalYear, parentEntityName, ultimateParentName, transactions, keyManagementCompensation } = input;

  if (!reportingEntityName) throw new DomainError('VALIDATION_FAILED', 'reportingEntityName is required');
  if (!fiscalYear) throw new DomainError('VALIDATION_FAILED', 'fiscalYear is required');

  // Group transactions by relationship
  const groupMap = new Map<string, RelatedPartyTransaction[]>();
  for (const t of transactions) {
    const group = groupMap.get(t.relationship) ?? [];
    group.push(t);
    groupMap.set(t.relationship, group);
  }

  const categories: DisclosureCategory[] = [...groupMap.entries()].map(([rel, txns]) => ({
    relationship: rel,
    transactionCount: txns.length,
    totalAmountMinor: txns.reduce((s, t) => s + t.amountMinor, 0),
    totalOutstandingMinor: txns.reduce((s, t) => s + t.outstandingBalanceMinor, 0),
    transactions: txns.map((t) => ({
      partyName: t.relatedPartyName,
      type: t.transactionType,
      amountMinor: t.amountMinor,
      outstandingMinor: t.outstandingBalanceMinor,
    })),
  }));

  const totalKmc = keyManagementCompensation.reduce((s, k) => s + k.amountMinor, 0);
  const kmcBreakdown = keyManagementCompensation.map((k) => ({ category: k.category, amountMinor: k.amountMinor }));

  const totalTxnValue = transactions.reduce((s, t) => s + t.amountMinor, 0);

  return {
    result: {
      entityName: reportingEntityName,
      fiscalYear,
      parentEntity: parentEntityName,
      ultimateParent: ultimateParentName,
      categories,
      totalKeyManagementCompMinor: totalKmc,
      keyManagementBreakdown: kmcBreakdown,
      totalTransactionCount: transactions.length,
      totalTransactionValueMinor: totalTxnValue,
    },
    inputs: { reportingEntityName, fiscalYear },
    explanation: `Related party disclosure for ${reportingEntityName} FY${fiscalYear}: ${transactions.length} transactions across ${categories.length} categories, KMC total=${totalKmc}`,
  };
}
