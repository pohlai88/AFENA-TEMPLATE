/**
 * Account Management Service
 * Manages shareholder account setup, profile, and KYC
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

// ============================================================================
// Interfaces
// ============================================================================

export interface ShareholderAccount {
  accountId: string;
  accountNumber: string;
  
  // Shareholder details
  shareholderId: string;
  holderName: string;
  holderType: 'INDIVIDUAL' | 'CORPORATE' | 'INSTITUTIONAL' | 'TRUST';
  
  // Holdings
  totalShares: number;
  shareClass: string;
  certificateNumbers: string[];
  
  // Ownership
  percentageOwnership: number;
  acquisitionDate: Date;
  costBasis: number;
  currentValue: number;
  
  // Contact
  email: string;
  phone?: string;
  address: string;
  
  // Portal access
  portalEnabled: boolean;
  lastLoginDate?: Date;
  
  status: 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
}

// ============================================================================
// Database Operations
// ============================================================================

export async function createShareholderAccount(
  _db: NeonHttpDatabase,
  _orgId: string,
  _account: Omit<ShareholderAccount, 'accountId' | 'accountNumber' | 'percentageOwnership' | 'currentValue'>
): Promise<ShareholderAccount> {
  // TODO: Create shareholder account
  throw new Error('Database integration pending');
}

// ============================================================================
// Helper Functions
// ============================================================================

export function generateAccountNumber(): string {
  const prefix = 'SH';
  const sequence = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  const checkDigit = calculateCheckDigit(sequence);
  return `${prefix}${sequence}${checkDigit}`;
}

function calculateCheckDigit(number: string): string {
  // Simple modulus 10 algorithm
  const sum = number
    .split('')
    .reverse()
    .reduce((acc, digit, index) => {
      const weight = index % 2 === 0 ? 2 : 1;
      return acc + parseInt(digit) * weight;
    }, 0);
  
  const remainder = sum % 10;
  return remainder === 0 ? '0' : (10 - remainder).toString();
}

export function identifyInactiveShareholders(
  accounts: ShareholderAccount[],
  inactiveDays: number = 365
): ShareholderAccount[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - inactiveDays);
  
  return accounts.filter(account => 
    account.portalEnabled &&
    (!account.lastLoginDate || account.lastLoginDate < cutoffDate)
  );
}
