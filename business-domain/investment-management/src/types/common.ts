/**
 * Investment Management Types
 * 
 * Type definitions for corporate investment portfolio management
 */

import { z } from 'zod';

// ── Enums ──────────────────────────────────────────────────────────

export enum InvestmentType {
  EQUITY = 'EQUITY', // Stock investments
  DEBT = 'DEBT', // Bonds, notes
  FUND = 'FUND', // Mutual funds, ETFs
  PRIVATE_EQUITY = 'PRIVATE_EQUITY',
  VENTURE_CAPITAL = 'VENTURE_CAPITAL',
  REAL_ESTATE = 'REAL_ESTATE',
  DERIVATIVE = 'DERIVATIVE',
  CASH_EQUIVALENT = 'CASH_EQUIVALENT',
}

export enum InvestmentStatus {
  ACTIVE = 'ACTIVE',
  MATURED = 'MATURED',
  SOLD = 'SOLD',
  IMPAIRED = 'IMPAIRED',
  DEFAULTED = 'DEFAULTED',
}

export enum ValuationMethod {
  MARK_TO_MARKET = 'MARK_TO_MARKET',
  EQUITY_METHOD = 'EQUITY_METHOD',
  COST_METHOD = 'COST_METHOD',
  FAIR_VALUE = 'FAIR_VALUE',
  AMORTIZED_COST = 'AMORTIZED_COST',
}

// ── Schemas ────────────────────────────────────────────────────────

export const investmentSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  investmentType: z.nativeEnum(InvestmentType),
  securityName: z.string(),
  securityIdentifier: z.string().optional(), // ISIN, CUSIP, ticker
  investeeCompany: z.string().optional(),
  purchaseDate: z.coerce.date(),
  purchasePrice: z.number().positive(),
  quantity: z.number().positive(),
  currentValue: z.number().positive(),
  unrealizedGainLoss: z.number(),
  ownershipPercent: z.number().min(0).max(100).optional(),
  valuationMethod: z.nativeEnum(ValuationMethod),
  status: z.nativeEnum(InvestmentStatus),
  maturityDate: z.coerce.date().optional(),
  interestRate: z.number().min(0).max(100).optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const transactionSchema = z.object({
  id: z.string().uuid(),
  investmentId: z.string().uuid(),
  transactionType: z.enum(['BUY', 'SELL', 'DIVIDEND', 'INTEREST', 'FEE', 'REVALUATION']),
  transactionDate: z.coerce.date(),
  quantity: z.number().optional(),
  price: z.number().optional(),
  amount: z.number(),
  description: z.string(),
  createdAt: z.coerce.date(),
});

export const valuationSchema = z.object({
  id: z.string().uuid(),
  investmentId: z.string().uuid(),
  valuationDate: z.coerce.date(),
  fairValue: z.number().positive(),
  unrealizedGainLoss: z.number(),
  valuationMethod: z.nativeEnum(ValuationMethod),
  valuedBy: z.string(),
  notes: z.string().optional(),
  createdAt: z.coerce.date(),
});

// ── Types ──────────────────────────────────────────────────────────

export type Investment = z.infer<typeof investmentSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
export type Valuation = z.infer<typeof valuationSchema>;

export interface PortfolioSummary {
  totalValue: number;
  costBasis: number;
  unrealizedGainLoss: number;
  realizedGainLoss: number;
  byType: Map<InvestmentType, {
    count: number;
    value: number;
    percent: number;
  }>;
  byStatus: Map<InvestmentStatus, number>;
  returnOnInvestment: number;
}

export interface PerformanceMetrics {
  investmentId: string;
  securityName: string;
  totalReturn: number; // Percentage
  annualizedReturn: number;
  holdingPeriodDays: number;
  dividendYield: number;
  currentValue: number;
  unrealizedGainLoss: number;
}
