/**
 * Sales Tax Service
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface NexusDetermination {
  state: string;
  hasNexus: boolean;
  reason: string;
  registrationRequired: boolean;
}

export interface SalesTaxCalculation {
  jurisdiction: string;
  taxableAmount: number;
  taxRate: number;
  taxAmount: number;
}

export async function determineNexus(
  db: NeonHttpDatabase,
  orgId: string,
  params: {
    state: string;
    salesVolume?: number;
    transactionCount?: number;
  },
): Promise<NexusDetermination> {
  // TODO: Determine economic nexus thresholds
  return {
    state: params.state,
    hasNexus: (params.salesVolume || 0) > 100000,
    reason: 'Economic nexus: sales exceed $100k',
    registrationRequired: true,
  };
}

export async function calculateSalesTax(
  db: NeonHttpDatabase,
  orgId: string,
  params: {
    shipToAddress: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
    amount: number;
    productTaxCategory?: string;
  },
): Promise<SalesTaxCalculation> {
// TODO: Lookup tax rate based on address
  return {
    jurisdiction: `${params.shipToAddress.city}, ${params.shipToAddress.state}`,
    taxableAmount: params.amount,
    taxRate: 0.0825,
    taxAmount: params.amount * 0.0825,
  };
}
