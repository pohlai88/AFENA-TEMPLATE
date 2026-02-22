import type { CompanyId } from '../types/branded';
import type { OrgId } from '../types/ids';

/**
 * DocumentNumberPort — cross-cutting interface for document number generation.
 *
 * Implemented by: gl-platform adapter (uses number_sequences table)
 * Consumed by: all packages that generate numbered documents
 *
 * Rule: Returns domain DTOs, never Drizzle row types.
 * Note: This port has a write-like semantic (next number is stateful),
 * but it is consumed as a read by domain packages. The actual sequence
 * increment happens in the CRUD layer via the adapter.
 */

export interface NumberSequenceInfo {
  sequenceId: string;
  prefix: string;
  currentValue: number;
  fiscalYear?: number;
  companyId: CompanyId;
}

export interface DocumentNumberPort {
  /** Get the next document number for a given document type and company. */
  getNextNumber(
    orgId: OrgId,
    companyId: CompanyId,
    documentType: string,
    fiscalYear?: number,
  ): Promise<string>;

  /** Preview the next number without incrementing (for display only). */
  peekNextNumber(
    orgId: OrgId,
    companyId: CompanyId,
    documentType: string,
    fiscalYear?: number,
  ): Promise<string>;
}
