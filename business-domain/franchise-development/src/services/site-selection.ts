import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { Site, SiteStatus } from '../types/common.js';

/**
 * Create a new site proposal
 */
export async function proposeSite(
  db: NeonHttpDatabase,
  orgId: string,
  data: Omit<Site, 'id' | 'createdAt' | 'status'>,
): Promise<Site> {
  // TODO: Insert into database with PROPOSED status
  // INSERT INTO sites (org_id, candidate_id, territory_id, address, status, ...)
  throw new Error('Database integration pending');
}

/**
 * Get sites by status
 */
export async function getSitesByStatus(
  db: NeonHttpDatabase,
  orgId: string,
  status?: SiteStatus,
): Promise<Site[]> {
  // TODO: Query database with optional status filter
  throw new Error('Database integration pending');
}

/**
 * Approve a site for development
 */
export async function approveSite(
  db: NeonHttpDatabase,
  siteId: string,
  approverId: string,
  notes?: string,
): Promise<Site> {
  // TODO: Update site status to APPROVED and set approval_date
  // UPDATE sites SET status = 'APPROVED', approval_date = NOW() WHERE id = $1
  throw new Error('Database integration pending');
}

/**
 * Score site based on market analysis criteria
 */
export function scoreSite(site: {
  address: string;
  demographics: {
    population: number;
    medianIncome: number;
    trafficCount: number;
  };
  competition: {
    competitorCount: number;
    distanceToNearest: number;
  };
}): {
  score: number;
  breakdown: Record<string, number>;
  recommended: boolean;
} {
  const breakdown: Record<string, number> = {};

  // Demographics (40 points)
  breakdown.population = scorePopulation(site.demographics.population);
  breakdown.income = scoreIncome(site.demographics.medianIncome);
  breakdown.traffic = scoreTraffic(site.demographics.trafficCount);

  // Competition (30 points)
  breakdown.competition = scoreCompetition(
    site.competition.competitorCount,
    site.competition.distanceToNearest,
  );

  // Location factors (30 points) - placeholder
  breakdown.visibility = 15;
  breakdown.accessibility = 15;

  const totalScore = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

  return {
    score: totalScore,
    breakdown,
    recommended: totalScore >= 70,
  };
}

function scorePopulation(population: number): number {
  if (population >= 50000) return 15;
  if (population >= 30000) return 12;
  if (population >= 15000) return 8;
  return 3;
}

function scoreIncome(medianIncome: number): number {
  if (medianIncome >= 75000) return 15;
  if (medianIncome >= 60000) return 12;
  if (medianIncome >= 45000) return 8;
  return 3;
}

function scoreTraffic(trafficCount: number): number {
  if (trafficCount >= 10000) return 10;
  if (trafficCount >= 5000) return 7;
  if (trafficCount >= 2000) return 4;
  return 1;
}

function scoreCompetition(competitorCount: number, distance: number): number {
  let score = 30;
  
  // Reduce score for too many competitors
  if (competitorCount >= 5) score -= 15;
  else if (competitorCount >= 3) score -= 10;
  else if (competitorCount >= 2) score -= 5;

  // Reduce score if competitors too close
  if (distance < 1) score -= 10; // Less than 1 mile
  else if (distance < 2) score -= 5;

  return Math.max(0, score);
}

/**
 * Generate site analysis report
 */
export function generateSiteAnalysisReport(
  site: Site,
  marketData: {
    population: number;
    medianIncome: number;
    competitors: number;
  },
): {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
} {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];

  // Analyze market data
  if (marketData.population >= 30000) {
    strengths.push('Strong population base (>30k)');
  } else {
    weaknesses.push('Limited population (<30k)');
    recommendations.push('Consider satellite location or pop-up format');
  }

  if (marketData.medianIncome >= 60000) {
    strengths.push('High median income ($60k+)');
  } else {
    weaknesses.push('Lower median income');
    recommendations.push('Focus on value positioning');
  }

  if (marketData.competitors <= 2) {
    strengths.push('Low competition (≤2 competitors)');
  } else {
    weaknesses.push('High competition (>2 competitors)');
    recommendations.push('Differentiation strategy required');
  }

  return { strengths, weaknesses, recommendations };
}

/**
 * Compare multiple sites and rank them
 */
export function rankSites(
  sites: Array<{
    id: string;
    score: number;
    cost: number;
  }>,
): Array<{
  id: string;
  rank: number;
  score: number;
  valueScore: number;
}> {
  // Calculate value score (score per dollar)
  const withValueScore = sites.map((site) => ({
    ...site,
    valueScore: site.cost > 0 ? site.score / site.cost : 0,
  }));

  // Sort by score descending
  withValueScore.sort((a, b) => b.score - a.score);

  // Assign ranks
  return withValueScore.map((site, index) => ({
    id: site.id,
    rank: index + 1,
    score: site.score,
    valueScore: site.valueScore,
  }));
}

/**
 * Calculate estimated site investment
 */
export function estimateSiteInvestment(
  squareFootage: number,
  buildoutCostPerSqFt: number,
  equipmentCost: number,
): {
  construction: number;
  equipment: number;
  workingCapital: number;
  total: number;
} {
  const construction = squareFootage * buildoutCostPerSqFt;
  const equipment = equipmentCost;
  const workingCapital = (construction + equipment) * 0.15; // 15% for working capital

  return {
    construction,
    equipment,
    workingCapital,
    total: construction + equipment + workingCapital,
  };
}

