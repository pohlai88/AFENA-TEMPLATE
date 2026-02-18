import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { DevelopmentAgreement } from '../types/common.js';

/**
 * Create a multi-unit development agreement
 */
export async function createDevelopmentAgreement(
  db: NeonHttpDatabase,
  orgId: string,
  data: Omit<DevelopmentAgreement, 'id'>,
): Promise<DevelopmentAgreement> {
  // TODO: Insert into database
  // INSERT INTO development_agreements (org_id, candidate_id, units_committed, ...)
  throw new Error('Database integration pending');
}

/**
 * Get development agreements for a candidate
 */
export async function getDevelopmentAgreements(
  db: NeonHttpDatabase,
  candidateId: string,
): Promise<DevelopmentAgreement[]> {
  // TODO: Query database
  // SELECT * FROM development_agreements WHERE candidate_id = $1
  throw new Error('Database integration pending');
}

/**
 * Track development schedule compliance
 */
export function trackDevelopmentSchedule(agreement: DevelopmentAgreement): {
  onTrack: number;
  delayed: number;
  completed: number;
  complianceRate: number;
} {
  const now = new Date();
  const summary = {
    onTrack: 0,
    delayed: 0,
    completed: 0,
    complianceRate: 0,
  };

  for (const unit of agreement.developmentSchedule) {
    if (unit.targetOpenDate < now) {
      // Past target date - check if opened
      // TODO: Check actual open dates from unit records
      summary.delayed++;
    } else {
      summary.onTrack++;
    }
  }

  summary.complianceRate = agreement.developmentSchedule.length > 0
    ? ((summary.completed + summary.onTrack) / agreement.developmentSchedule.length) * 100
    : 0;

  return summary;
}

/**
 * Calculate development fee revenue
 */
export function calculateDevelopmentFees(agreements: DevelopmentAgreement[]): {
  totalCommitted: number;
  totalCollected: number;
  unitsInPipeline: number;
  averageFeePerUnit: number;
} {
  let totalCommitted = 0;
  let totalFees = 0;
  let totalUnits = 0;

  for (const agreement of agreements) {
    totalCommitted += agreement.developmentFee;
    totalFees += agreement.developmentFee; // TODO: Track actual collections
    totalUnits += agreement.unitsCommitted;
  }

  return {
    totalCommitted,
    totalCollected: totalFees,
    unitsInPipeline: totalUnits,
    averageFeePerUnit: totalUnits > 0 ? totalFees / totalUnits : 0,
  };
}

/**
 * Generate development schedule for multi-unit agreement
 */
export function generateDevelopmentSchedule(
  unitsCommitted: number,
  startDate: Date,
  monthsBetweenUnits: number = 6,
): Array<{ unitNumber: number; targetOpenDate: Date }> {
  const schedule = [];
  
  for (let i = 1; i <= unitsCommitted; i++) {
    const targetDate = new Date(startDate);
    targetDate.setMonth(targetDate.getMonth() + (i - 1) * monthsBetweenUnits);
    
    schedule.push({
      unitNumber: i,
      targetOpenDate: targetDate,
    });
  }

  return schedule;
}

/**
 * Assess development agreement risk
 */
export function assessAgreementRisk(
  agreement: DevelopmentAgreement,
  candidateFinancials: { netWorth: number; liquidCapital: number },
): {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  factors: string[];
} {
  const factors: string[] = [];
  let riskScore = 0;

  // Financial capacity vs. commitment
  const estimatedInvestment = agreement.unitsCommitted * 300000; // $300k per unit assumption
  if (candidateFinancials.netWorth < estimatedInvestment * 1.5) {
    riskScore += 30;
    factors.push('Net worth below 1.5x total investment');
  }

  if (candidateFinancials.liquidCapital < estimatedInvestment * 0.3) {
    riskScore += 25;
    factors.push('Insufficient liquid capital for development');
  }

  // Overcommitment - too many units too fast
  if (agreement.unitsCommitted > 5) {
    riskScore += 20;
    factors.push('High unit commitment (>5 units)');
  }

  // Schedule aggressiveness
  const avgMonthsBetween = calculateAverageMonthsBetween(agreement.developmentSchedule);
  if (avgMonthsBetween < 6) {
    riskScore += 15;
    factors.push('Aggressive development timeline (<6 months between units)');
  }

  // Time to first unit
  const monthsToFirst = monthsUntil(agreement.signedDate, agreement.developmentSchedule[0]?.targetOpenDate);
  if (monthsToFirst < 12) {
    riskScore += 10;
    factors.push('Limited time to first opening (<12 months)');
  }

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (riskScore >= 50) riskLevel = 'HIGH';
  else if (riskScore >= 25) riskLevel = 'MEDIUM';

  return { riskLevel, factors };
}

/**
 * Calculate average months between unit openings
 */
function calculateAverageMonthsBetween(
  schedule: Array<{ unitNumber: number; targetOpenDate: Date }>,
): number {
  if (schedule.length < 2) return 12; // Default

  const intervals = [];
  for (let i = 1; i < schedule.length; i++) {
    const months = monthsUntil(schedule[i - 1].targetOpenDate, schedule[i].targetOpenDate);
    intervals.push(months);
  }

  return intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
}

/**
 * Calculate months between two dates
 */
function monthsUntil(from: Date, to: Date): number {
  const yearsDiff = to.getFullYear() - from.getFullYear();
  const monthsDiff = to.getMonth() - from.getMonth();
  return yearsDiff * 12 + monthsDiff;
}

