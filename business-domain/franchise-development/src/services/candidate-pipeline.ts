import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { Candidate, CandidateStage, PipelineMetrics } from '../types/common.js';

/**
 * Create a new franchise candidate lead
 */
export async function createCandidate(
  db: NeonHttpDatabase,
  orgId: string,
  data: Omit<Candidate, 'id' | 'createdAt' | 'stage'>,
): Promise<Candidate> {
  // TODO: Insert into database with LEAD stage
  // INSERT INTO candidates (org_id, name, email, net_worth, stage, ...)
  throw new Error('Database integration pending');
}

/**
 * Get all candidates by stage
 */
export async function getCandidatesByStage(
  db: NeonHttpDatabase,
  orgId: string,
  stage?: CandidateStage,
): Promise<Candidate[]> {
  // TODO: Query database with optional stage filter
  throw new Error('Database integration pending');
}

/**
 * Advance candidate to next stage in pipeline
 */
export async function advanceCandidate(
  db: NeonHttpDatabase,
  candidateId: string,
  newStage: CandidateStage,
  notes?: string,
): Promise<Candidate> {
  // TODO: Update candidate stage and log stage transition
  // UPDATE candidates SET stage = $1 WHERE id = $2
  // INSERT INTO candidate_stage_history (candidate_id, from_stage, to_stage, notes)
  throw new Error('Database integration pending');
}

/**
 * Qualify candidate based on financial and experience criteria
 */
export function qualifyCandidate(candidate: Candidate): {
  qualified: boolean;
  score: number;
  reasons: string[];
} {
  const reasons: string[] = [];
  let score = 0;

  // Financial qualification (40 points)
  if (candidate.liquidCapital && candidate.liquidCapital >= 100000) {
    score += 20;
    reasons.push('Sufficient liquid capital');
  } else {
    reasons.push('Insufficient liquid capital (<$100k)');
  }

  if (candidate.netWorth && candidate.netWorth >= 250000) {
    score += 20;
    reasons.push('Sufficient net worth');
  } else {
    reasons.push('Insufficient net worth (<$250k)');
  }

  // Experience (30 points)
  if (candidate.experience && candidate.experience.includes('management')) {
    score += 30;
    reasons.push('Management experience verified');
  } else {
    reasons.push('Limited management experience');
  }

  // Additional factors (30 points) - placeholder
  score += 15; // Assume average score for other factors

  return {
    qualified: score >= 60,
    score,
    reasons,
  };
}

/**
 * Calculate pipeline metrics and conversion rates
 */
export async function getPipelineMetrics(
  db: NeonHttpDatabase,
  orgId: string,
  dateFrom?: Date,
  dateTo?: Date,
): Promise<PipelineMetrics> {
  // TODO: Query database for candidate counts by stage
  // SELECT stage, COUNT(*) FROM candidates WHERE org_id = $1 GROUP BY stage
  
  // Placeholder calculations
  const totalLeads = 100;
  const qualified = 40;
  const approved = 20;
  const signed = 10;

  return {
    totalLeads,
    qualified,
    approved,
    signed,
    conversionRate: (signed / totalLeads) * 100,
    averageDaysToSign: 90, // TODO: Calculate from stage history
  };
}

/**
 * Score candidate against ideal franchisee profile
 */
export function scoreCandidate(candidate: Candidate, weights: {
  financialWeight: number;
  experienceWeight: number;
  motivationWeight: number;
}): number {
  let score = 0;

  // Financial component
  const financialScore = calculateFinancialScore(
    candidate.netWorth || 0,
    candidate.liquidCapital || 0,
  );
  score += financialScore * weights.financialWeight;

  // Experience component (placeholder)
  const experienceScore = 70; // TODO: Parse and score experience
  score += experienceScore * weights.experienceWeight;

  // Motivation/fit component (placeholder)
  const motivationScore = 60; // TODO: From interview scores
  score += motivationScore * weights.motivationWeight;

  return Math.min(100, score);
}

/**
 * Calculate financial qualification score (0-100)
 */
function calculateFinancialScore(netWorth: number, liquidCapital: number): number {
  let score = 0;

  // Liquid capital scoring (0-50 points)
  if (liquidCapital >= 200000) score += 50;
  else if (liquidCapital >= 150000) score += 40;
  else if (liquidCapital >= 100000) score += 30;
  else if (liquidCapital >= 50000) score += 15;

  // Net worth scoring (0-50 points)
  if (netWorth >= 500000) score += 50;
  else if (netWorth >= 350000) score += 40;
  else if (netWorth >= 250000) score += 30;
  else if (netWorth >= 150000) score += 15;

  return score;
}

/**
 * Identify candidates at risk of dropping from pipeline
 */
export function identifyAtRiskCandidates(
  candidates: Candidate[],
  daysSinceLastContact: Map<string, number>,
): Candidate[] {
  return candidates.filter((candidate) => {
    const days = daysSinceLastContact.get(candidate.id) || 0;
    
    // Risk thresholds by stage
    if (candidate.stage === 'LEAD' && days > 14) return true;
    if (candidate.stage === 'QUALIFIED' && days > 30) return true;
    if (candidate.stage === 'APPROVED' && days > 60) return true;
    
    return false;
  });
}

