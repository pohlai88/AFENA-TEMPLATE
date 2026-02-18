import type { BaseEntity } from '@afenda/canon';

/**
 * Types of equity grants
 */
export enum GrantType {
  /** Stock Options - Incentive Stock Options */
  ISO = 'ISO',
  /** Stock Options - Non-Qualified Stock Options */
  NSO = 'NSO',
  /** Restricted Stock Units */
  RSU = 'RSU',
  /** Performance Stock Units */
  PSU = 'PSU',
  /** Stock Appreciation Rights */
  SAR = 'SAR',
  /** Phantom Stock */
  PHANTOM = 'PHANTOM',
}

/**
 * Vesting types
 */
export enum VestingType {
  /** Time-based vesting (cliff + graded) */
  TIME_BASED = 'TIME_BASED',
  /** Performance-based vesting (revenue, EBITDA, milestones) */
  PERFORMANCE_BASED = 'PERFORMANCE_BASED',
  /** Market-based vesting (stock price, TSR) */
  MARKET_BASED = 'MARKET_BASED',
  /** Hybrid (multiple conditions) */
  HYBRID = 'HYBRID',
}

/**
 * Grant status
 */
export enum GrantStatus {
  /** Active grant, vesting in progress */
  ACTIVE = 'ACTIVE',
  /** Fully vested */
  VESTED = 'VESTED',
  /** Exercised (options) or settled (RSUs/PSUs) */
  EXERCISED = 'EXERCISED',
  /** Cancelled before vesting */
  CANCELLED = 'CANCELLED',
  /** Expired (post-termination expiry) */
  EXPIRED = 'EXPIRED',
  /** Forfeited (employment termination) */
  FORFEITED = 'FORFEITED',
}

/**
 * Valuation methods for fair value calculation
 */
export enum ValuationMethod {
  /** Black-Scholes option pricing model */
  BLACK_SCHOLES = 'BLACK_SCHOLES',
  /** Monte Carlo simulation */
  MONTE_CARLO = 'MONTE_CARLO',
  /** Lattice model (binomial/trinomial) */
  LATTICE = 'LATTICE',
  /** 409A third-party valuation */
  VALUATION_409A = 'VALUATION_409A',
}

/**
 * Vesting frequency
 */
export type VestingFrequency = 'monthly' | 'quarterly' | 'annually' | 'milestone';

/**
 * Stock grant entity
 */
export interface StockGrant extends BaseEntity {
  /** Employee ID */
  employeeId: string;
  
  /** Grant type */
  grantType: GrantType;
  
  /** Grant date */
  grantDate: Date;
  
  /** Number of shares/units granted */
  sharesGranted: number;
  
  /** Strike/exercise price (options only) */
  strikePrice: number | null;
  
  /** Fair value per share at grant date */
  fairValuePerShare: number;
  
  /** Total fair value of grant */
  totalFairValue: number;
  
  /** Vesting type */
  vestingType: VestingType;
  
  /** Vesting schedule parameters */
  vestingSchedule: VestingSchedule;
  
  /** Grant status */
  status: GrantStatus;
  
  /** Shares vested to date */
  sharesVested: number;
  
  /** Shares exercised/settled */
  sharesExercised: number;
  
  /** Shares forfeited */
  sharesForfeited: number;
  
  /** Shares remaining (unvested) */
  sharesRemaining: number;
  
  /** Expiration date (options) */
  expirationDate: Date | null;
  
  /** Post-termination exercise period (days) */
  postTermExerciseDays: number | null;
  
  /** Award agreement reference */
  agreementId: string | null;
  
  /** Notes */
  notes: string | null;
}

/**
 * Vesting schedule configuration
 */
export interface VestingSchedule {
  /** Cliff period in months */
  cliffMonths: number;
  
  /** Total vesting period in months */
  vestingMonths: number;
  
  /** Vesting frequency */
  vestingFrequency: VestingFrequency;
  
  /** Performance conditions (if performance-based) */
  performanceConditions?: PerformanceCondition[];
  
  /** Market conditions (if market-based) */
  marketConditions?: MarketCondition[];
}

/**
 * Performance vesting condition
 */
export interface PerformanceCondition {
  /** Metric type (revenue, ebitda, etc) */
  metric: string;
  
  /** Target value */
  target: number;
  
  /** Threshold (minimum for any vesting) */
  threshold: number;
  
  /** Maximum (for accelerated vesting) */
  maximum: number;
  
  /** Vesting percentage at threshold */
  thresholdPct: number;
  
  /** Vesting percentage at target */
  targetPct: number;
  
  /** Vesting percentage at maximum */
  maximumPct: number;
  
  /** Measurement period */
  measurementPeriod: string;
}

/**
 * Market condition for vesting
 */
export interface MarketCondition {
  /** Metric (stock price, TSR, etc) */
  metric: string;
  
  /** Target value */
  target: number;
  
  /** Measurement date */
  measurementDate: Date;
  
  /** Relative (to peer group) or absolute */
  relative: boolean;
  
  /** Peer group if relative */
  peerGroup?: string[];
}

/**
 * Vesting tranche
 */
export interface VestingTranche {
  /** Grant ID */
  grantId: string;
  
  /** Vesting date */
  vestDate: Date;
  
  /** Shares vesting on this date */
  sharesVesting: number;
  
  /** Cumulative shares vested */
  cumulativeShares: number;
  
  /** Tranche status */
  status: 'scheduled' | 'vested' | 'forfeited';
  
  /** Actual vest date (if different from scheduled) */
  actualVestDate: Date | null;
}

/**
 * Fair value calculation inputs
 */
export interface FairValueInputs {
  /** Current stock price */
  stockPrice: number;
  
  /** Strike/exercise price */
  strikePrice: number;
  
  /** Expected volatility (annualized) */
  volatility: number;
  
  /** Risk-free interest rate */
  riskFreeRate: number;
  
  /** Expected dividend yield */
  dividendYield: number;
  
  /** Expected term (years) */
  timeToExpiration: number;
  
  /** Early exercise multiple (lattice) */
  earlyExerciseMultiple?: number;
  
  /** Post-vesting termination rate */
  postVestTerminationRate?: number;
}

/**
 * Grant exercise record
 */
export interface GrantExercise extends BaseEntity {
  /** Grant ID */
  grantId: string;
  
  /** Exercise date */
  exerciseDate: Date;
  
  /** Shares exercised */
  sharesExercised: number;
  
  /** Strike price per share */
  strikePrice: number;
  
  /** Fair market value at exercise */
  fairMarketValue: number;
  
  /** Gross proceeds (FMV * shares) */
  grossProceeds: number;
  
  /** Exercise cost (strike * shares) */
  exerciseCost: number;
  
  /** Intrinsic value at exercise */
  intrinsicValue: number;
  
  /** Cashless exercise */
  cashlessExercise: boolean;
  
  /** Shares sold to cover */
  sharesSoldToCover: number;
  
  /** Shares retained */
  sharesRetained: number;
  
  /** Tax withholding amount */
  taxWithheld: number;
  
  /** Net proceeds to employee */
  netProceeds: number;
  
  /** Certificate number (if physical) */
  certificateNumber: string | null;
}

/**
 * Grant modification record
 */
export interface GrantModification extends BaseEntity {
  /** Original grant ID */
  grantId: string;
  
  /** Modification date */
  modificationDate: Date;
  
  /** Modification type */
  modificationType: 'repricing' | 'vesting_acceleration' | 'extension' | 'cancellation';
  
  /** Old terms */
  oldTerms: Record<string, unknown>;
  
  /** New terms */
  newTerms: Record<string, unknown>;
  
  /** Incremental fair value (ASC 718) */
  incrementalFairValue: number | null;
  
  /** Reason for modification */
  reason: string;
  
  /** Board approval date */
  boardApprovalDate: Date | null;
  
  /** Shareholder approval required */
  shareholderApprovalRequired: boolean;
}

/**
 * Compensation expense record
 */
export interface CompensationExpense extends BaseEntity {
  /** Grant ID */
  grantId: string;
  
  /** Accounting period */
  period: string;
  
  /** Total fair value to expense */
  totalFairValue: number;
  
  /** Service period (months) */
  servicePeriodMonths: number;
  
  /** Requisite service period */
  requisiteServicePeriod: Date;
  
  /** Graded vesting attribution */
  gradedVesting: boolean;
  
  /** Estimated forfeiture rate */
  forfeitureRate: number;
  
  /** Expense for period */
  periodExpense: number;
  
  /** Cumulative expense to date */
  cumulativeExpense: number;
  
  /** Remaining unrecognized expense */
  remainingExpense: number;
  
  /** GL account for posting */
  glAccount: string | null;
  
  /** Posted to GL */
  postedToGL: boolean;
  
  /** Posted date */
  postedDate: Date | null;
}

/**
 * Tax withholding record
 */
export interface TaxWithholding {
  /** Federal income tax */
  federalIncomeTax: number;
  
  /** State income tax */
  stateIncomeTax: number;
  
  /** FICA (Social Security + Medicare) */
  fica: number;
  
  /** Total withholding */
  totalWithholding: number;
  
  /** Shares sold to cover */
  sharesSoldToCover: number;
}

/**
 * 409A valuation record
 */
export interface Valuation409A extends BaseEntity {
  /** Valuation date */
  valuationDate: Date;
  
  /** Fair market value per share */
  fmv: number;
  
  /** Valuation firm */
  valuationFirm: string | null;
  
  /** Valuation report ID */
  reportId: string | null;
  
  /** Effective start date */
  effectiveDate: Date;
  
  /** Expiration date (12 months or material event) */
  expirationDate: Date;
  
  /** Board approval date */
  boardApprovalDate: Date | null;
}

/**
 * Create grant parameters
 */
export interface CreateGrantParams {
  employeeId: string;
  grantType: GrantType;
  grantDate: Date;
  sharesGranted: number;
  vestingType: VestingType;
  vestingSchedule: VestingSchedule;
  fairValuePerShare: number;
  strikePrice?: number | null;
  expirationYears?: number;
  postTermExerciseDays?: number;
  agreementId?: string;
  notes?: string;
}

/**
 * Calculate fair value parameters
 */
export interface CalculateFairValueParams {
  grantId: string;
  method: ValuationMethod;
  inputs: FairValueInputs;
  monteCarloSimulations?: number;
}

/**
 * Calculate vesting schedule parameters
 */
export interface CalculateVestingScheduleParams {
  grantId: string;
  grantDate: Date;
  sharesGranted: number;
  vestingSchedule: VestingSchedule;
}

/**
 * Calculate compensation expense parameters
 */
export interface CalculateCompensationExpenseParams {
  grantId: string;
  period: string;
  vestingMethod: 'graded' | 'straight-line';
  forfeitureRate: number;
}

/**
 * Process exercise parameters
 */
export interface ProcessExerciseParams {
  grantId: string;
  exerciseDate: Date;
  sharesExercised: number;
  fairMarketValue: number;
  cashlessExercise: boolean;
  taxWithholding?: {
    federalRate: number;
    stateRate: number;
    ficaRate: number;
  };
}
