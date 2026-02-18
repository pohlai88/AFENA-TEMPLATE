/**
 * Holdings Inquiry Service
 * Manages share balance, transaction history, and portfolio tracking
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

// ============================================================================
// Interfaces
// ============================================================================

export interface ShareTransaction {
  transactionId: string;
  shareholderId: string;
  
  // Transaction details
  transactionType: 'PURCHASE' | 'SALE' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 
                   'DIVIDEND_REINVESTMENT' | 'STOCK_SPLIT' | 'BONUS_ISSUE';
  transactionDate: Date;
  settlementDate: Date;
  
  // Shares
  shareClass: string;
  quantity: number;
  pricePerShare: number;
  totalAmount: number;
  
  // Parties
  counterparty?: string;
  broker?: string;
  
  // Reference
  referenceNumber: string;
  notes?: string;
  
  status: 'PENDING' | 'SETTLED' | 'CANCELLED';
}

export interface ShareholderDocument {
  documentId: string;
  shareholderId?: string; // null for public documents
  
  // Classification
  documentType: 'ANNUAL_REPORT' | 'FINANCIAL_STATEMENT' | 'MEETING_MINUTES' | 
                'PROSPECTUS' | 'CERTIFICATE' | 'TAX_FORM' | 'OTHER';
  
  // Details
  title: string;
  description?: string;
  fiscalYear?: number;
  
  // Storage
  fileUrl: string;
  fileSize: number;
  
  // Access
  isPublic: boolean;
  restrictedToClasses?: string[];
  
  // Tracking
  uploadDate: Date;
  downloadCount: number;
  
  status: 'AVAILABLE' | 'ARCHIVED';
}

// ============================================================================
// Database Operations
// ============================================================================

export async function recordShareTransaction(
  _db: NeonHttpDatabase,
  _orgId: string,
  _transaction: Omit<ShareTransaction, 'transactionId'>
): Promise<ShareTransaction> {
  // TODO: Record share transaction
  throw new Error('Database integration pending');
}

// ============================================================================
// Helper Functions
// ============================================================================

export function calculatePercentageOwnership(
  shareholderShares: number,
  totalIssuedShares: number
): number {
  if (totalIssuedShares === 0) return 0;
  return Math.round((shareholderShares / totalIssuedShares) * 10000) / 100;
}

export function calculateShareholderReturn(
  purchases: ShareTransaction[],
  sales: ShareTransaction[],
  dividends: Array<{ netDividend: number }>,
  currentSharePrice: number
): {
  totalInvestment: number;
  totalDividends: number;
  realizedGains: number;
  unrealizedGains: number;
  totalReturn: number;
  returnPercentage: number;
} {
  // Total investment (purchases)
  const totalInvestment = purchases.reduce((sum, txn) => sum + txn.totalAmount, 0);
  
  // Total dividends received
  const totalDividends = dividends.reduce((sum, div) => sum + div.netDividend, 0);
  
  // Realized gains from sales
  const totalSaleProceeds = sales.reduce((sum, txn) => sum + txn.totalAmount, 0);
  const soldSharesCost = sales.reduce((sum, txn) => sum + (txn.quantity * txn.pricePerShare), 0);
  const realizedGains = totalSaleProceeds - soldSharesCost;
  
  // Unrealized gains (current holdings)
  const sharesHeld = purchases.reduce((sum, txn) => sum + txn.quantity, 0) - 
                     sales.reduce((sum, txn) => sum + txn.quantity, 0);
  const costBasis = (totalInvestment - soldSharesCost);
  const currentValue = sharesHeld * currentSharePrice;
  const unrealizedGains = currentValue - costBasis;
  
  // Total return
  const totalReturn = totalDividends + realizedGains + unrealizedGains;
  const returnPercentage = totalInvestment > 0 ? (totalReturn / totalInvestment) * 100 : 0;
  
  return {
    totalInvestment: Math.round(totalInvestment),
    totalDividends: Math.round(totalDividends),
    realizedGains: Math.round(realizedGains),
    unrealizedGains: Math.round(unrealizedGains),
    totalReturn: Math.round(totalReturn),
    returnPercentage: Math.round(returnPercentage * 100) / 100,
  };
}
