import type { CompanyId } from '../types/branded';
import type { OrgId } from '../types/ids';

/**
 * PartyMasterPort — cross-cutting read interface for supplier/customer master data.
 *
 * Implemented by: contacts/CRM adapter
 * Consumed by: payables, receivables, credit-management, expense-management
 *
 * Rule: Returns domain DTOs, never Drizzle row types.
 */

export type PartyType = 'customer' | 'supplier' | 'employee' | 'both';

export interface PartyInfo {
  partyId: string;
  partyType: PartyType;
  name: string;
  taxId?: string;
  currency: string;
  paymentTerms?: string;
  creditLimit?: number;
  isActive: boolean;
}

export interface PartyAddress {
  addressId: string;
  partyId: string;
  addressType: 'billing' | 'shipping' | 'registered';
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
}

export interface PartyMasterPort {
  /** Get party master data by ID. */
  getParty(orgId: OrgId, partyId: string): Promise<PartyInfo | null>;

  /** Get party by type and company. */
  listParties(
    orgId: OrgId,
    companyId: CompanyId,
    partyType: PartyType,
    options?: { isActive?: boolean; limit?: number },
  ): Promise<readonly PartyInfo[]>;

  /** Get billing address for a party. */
  getBillingAddress(orgId: OrgId, partyId: string): Promise<PartyAddress | null>;
}
