/**
 * Cap Table Management Types
 * 
 * Type definitions for capitalization table and ownership tracking
 */

import { z } from 'zod';

// ── Enums ──────────────────────────────────────────────────────────

export enum ShareClass {
  COMMON = 'COMMON',
  PREFERRED_SERIES_SEED = 'PREFERRED_SERIES_SEED',
  PREFERRED_SERIES_A = 'PREFERRED_SERIES_A',
  PREFERRED_SERIES_B = 'PREFERRED_SERIES_B',
  PREFERRED_SERIES_C = 'PREFERRED_SERIES_C',
  PREFERRED_SERIES_D = 'PREFERRED_SERIES_D',
  WARRANT = 'WARRANT',
  SAFE = 'SAFE',
  CONVERTIBLE_NOTE = 'CONVERTIBLE_NOTE',
}

export enum ShareholderType {
  FOUNDER = 'FOUNDER',
  EMPLOYEE = 'EMPLOYEE',
  ANGEL_INVESTOR = 'ANGEL_INVESTOR',
  VENTURE_CAPITAL = 'VENTURE_CAPITAL',
  STRATEGIC_INVESTOR = 'STRATEGIC_INVESTOR',
  INSTITUTIONAL = 'INSTITUTIONAL',
}

export enum VestingScheduleType {
  TIME_BASED = 'TIME_BASED',
  MILESTONE_BASED = 'MILESTONE_BASED',
  HYBRID = 'HYBRID',
}

// ── Zod Schemas ────────────────────────────────────────────────────

export const shareholderSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email().optional(),
  type: z.nativeEnum(ShareholderType),
  entityId: z.string().optional(), // For institutional investors
  taxId: z.string().optional(),
  address: z.string().optional(),
  isAccreditedInvestor: z.boolean().default(false),
  joinedDate: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const shareClassSchema = z.object({
  id: z.string().uuid(),
  class: z.nativeEnum(ShareClass),
  name: z.string(),
  authorizedShares: z.number().int().positive(),
  issuedShares: z.number().int().nonnegative(),
  outstandingShares: z.number().int().nonnegative(),
  parValue: z.number().nonnegative(),
  liquidationPreference: z.number().positive().optional(), // multiple of investment
  participationRights: z.boolean().default(false),
  conversionRatio: z.number().positive().default(1),
  dividendRate: z.number().nonnegative().optional(),
  votingRights: z.number().positive().default(1), // votes per share
  createdAt: z.coerce.date(),
});

export const shareholdingSchema = z.object({
  id: z.string().uuid(),
  shareholderId: z.string().uuid(),
  shareClassId: z.string().uuid(),
  shares: z.number().int().positive(),
  pricePerShare: z.number().positive(),
  totalInvestment: z.number().positive(),
  purchaseDate: z.coerce.date(),
  certificateNumber: z.string().optional(),
  vestingScheduleId: z.string().uuid().optional(),
  fullyVested: z.boolean().default(false),
  vestedShares: z.number().int().nonnegative(),
  createdAt: z.coerce.date(),
});

export const fundingRoundSchema = z.object({
  id: z.string().uuid(),
  name: z.string(), // e.g., "Series A"
  roundType: z.enum(['SEED', 'SERIES_A', 'SERIES_B', 'SERIES_C', 'SERIES_D', 'BRIDGE']),
  closeDate: z.coerce.date(),
  preMoneyValuation: z.number().positive(),
  postMoneyValuation: z.number().positive(),
  totalRaised: z.number().positive(),
  pricePerShare: z.number().positive(),
  shareClassId: z.string().uuid(),
  leadInvestor: z.string().optional(),
  createdAt: z.coerce.date(),
});

// ── TypeScript Types ───────────────────────────────────────────────

export type Shareholder = z.infer<typeof shareholderSchema>;
export type ShareClassInfo = z.infer<typeof shareClassSchema>;
export type Shareholding = z.infer<typeof shareholdingSchema>;
export type FundingRound = z.infer<typeof fundingRoundSchema>;

export interface CapTableSnapshot {
  asOfDate: Date;
  totalShares: number;
  fullyDilutedShares: number;
  valuation: number;
  pricePerShare: number;
  shareholders: Array<{
    shareholderId: string;
    shareholderName: string;
    shareholderType: ShareholderType;
    shareClass: ShareClass;
    shares: number;
    ownershipPercent: number;
    fullyDilutedPercent: number;
    investmentAmount: number;
    currentValue: number;
  }>;
}

export interface DilutionAnalysis {
  scenario: string;
  preMoneyValuation: number;
  newInvestment: number;
  postMoneyValuation: number;
  pricePerShare: number;
  newShares: number;
  existingShareholders: Array<{
    shareholderId: string;
    shareholderName: string;
    currentShares: number;
    currentOwnership: number;
    postRoundOwnership: number;
    dilution: number;
  }>;
}

export interface LiquidationWaterfall {
  exitValue: number;
  distributions: Array<{
    shareholderId: string;
    shareholderName: string;
    shareClass: ShareClass;
    shares: number;
    liquidationPreference: number;
    participationAmount: number;
    commonDistribution: number;
    totalPayout: number;
    returnMultiple: number;
  }>;
  totalDistributed: number;
  remainingValue: number;
}
