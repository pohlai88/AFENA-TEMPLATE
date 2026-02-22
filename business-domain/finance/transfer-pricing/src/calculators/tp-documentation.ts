import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * TP-05 — TP Documentation: Master File + Local File (BEPS Action 13)
 *
 * Generates structured transfer pricing documentation outline with required
 * OECD BEPS Action 13 sections for master file and local file.
 * Pure function — no I/O.
 */

export type TpDocEntity = {
  entityId: string;
  entityName: string;
  jurisdiction: string;
  functionalCurrency: string;
};

export type IcTransaction = {
  transactionId: string;
  counterpartyId: string;
  description: string;
  amountMinor: number;
  tpMethod: string;
};

export type TpDocInput = {
  groupName: string;
  fiscalYear: string;
  masterFileEntity: TpDocEntity;
  localFileEntity: TpDocEntity;
  icTransactions: IcTransaction[];
  groupRevenueTotalMinor: number;
  tpPolicySummary: string;
};

export type DocumentSection = {
  sectionNumber: string;
  title: string;
  status: 'complete' | 'draft' | 'missing';
  content?: string;
};

export type TpDocResult = {
  masterFileSections: DocumentSection[];
  localFileSections: DocumentSection[];
  masterFileCompletePct: number;
  localFileCompletePct: number;
  totalIcTransactions: number;
  totalIcValueMinor: number;
};

export function generateTpDocumentation(input: TpDocInput): CalculatorResult<TpDocResult> {
  const { groupName, fiscalYear, masterFileEntity, localFileEntity, icTransactions, groupRevenueTotalMinor, tpPolicySummary } = input;

  if (!groupName) throw new DomainError('VALIDATION_FAILED', 'groupName is required');
  if (!fiscalYear) throw new DomainError('VALIDATION_FAILED', 'fiscalYear is required');

  // BEPS Action 13 Master File sections
  const masterSections: DocumentSection[] = [
    { sectionNumber: 'MF-1', title: 'Organisational structure', status: 'complete', content: `Group: ${groupName}, HQ: ${masterFileEntity.jurisdiction}` },
    { sectionNumber: 'MF-2', title: 'Description of business(es)', status: tpPolicySummary ? 'complete' : 'missing', ...(tpPolicySummary ? { content: tpPolicySummary } : {}) },
    { sectionNumber: 'MF-3', title: 'Intangibles', status: 'draft' },
    { sectionNumber: 'MF-4', title: 'Intercompany financial activities', status: icTransactions.length > 0 ? 'complete' : 'missing' },
    { sectionNumber: 'MF-5', title: 'Financial and tax positions', status: groupRevenueTotalMinor > 0 ? 'complete' : 'missing', content: `Group revenue: ${groupRevenueTotalMinor}` },
  ];

  // BEPS Action 13 Local File sections
  const localSections: DocumentSection[] = [
    { sectionNumber: 'LF-1', title: 'Local entity overview', status: 'complete', content: `Entity: ${localFileEntity.entityName}, Jurisdiction: ${localFileEntity.jurisdiction}` },
    { sectionNumber: 'LF-2', title: 'Controlled transactions', status: icTransactions.length > 0 ? 'complete' : 'missing' },
    { sectionNumber: 'LF-3', title: 'Comparability analysis', status: 'draft' },
    { sectionNumber: 'LF-4', title: 'Selection of TP method', status: icTransactions.some((t) => t.tpMethod) ? 'complete' : 'missing' },
    { sectionNumber: 'LF-5', title: 'Financial data', status: 'draft' },
  ];

  const masterComplete = masterSections.filter((s) => s.status === 'complete').length;
  const localComplete = localSections.filter((s) => s.status === 'complete').length;
  const totalIcValue = icTransactions.reduce((s, t) => s + t.amountMinor, 0);

  return {
    result: {
      masterFileSections: masterSections,
      localFileSections: localSections,
      masterFileCompletePct: Math.round((masterComplete / masterSections.length) * 100),
      localFileCompletePct: Math.round((localComplete / localSections.length) * 100),
      totalIcTransactions: icTransactions.length,
      totalIcValueMinor: totalIcValue,
    },
    inputs: { groupName, fiscalYear, entityId: localFileEntity.entityId },
    explanation: `TP documentation for ${groupName} FY${fiscalYear}: master file ${masterComplete}/${masterSections.length}, local file ${localComplete}/${localSections.length}, ${icTransactions.length} IC transactions`,
  };
}
