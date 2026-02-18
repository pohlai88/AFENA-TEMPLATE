import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { DevelopmentMetrics, PipelineMetrics } from '../types/common.js';

/**
 * Generate comprehensive development analytics dashboard
 */
export async function getDevelopmentDashboard(
  db: NeonHttpDatabase,
  orgId: string,
  dateFrom: Date,
  dateTo: Date,
): Promise<{
  pipeline: PipelineMetrics;
  development: DevelopmentMetrics;
  revenue: {
    developmentFees: number;
    projectedRoyalties: number;
  };
  health: {
    conversionRate: number;
    timeToSign: number;
    timeToOpen: number;
  };
}> {
  // TODO: Query database for comprehensive metrics
  throw new Error('Database integration pending');
}

/**
 * Calculate territory coverage metrics
 */
export function calculateTerritoryCoverage(territories: Array<{
  status: string;
  population: number;
}>): {
  totalTerritories: number;
  developedPercentage: number;
  availableForExpansion: number;
  totalPopulationCoverage: number;
} {
  const total = territories.length;
  const developed = territories.filter((t) => t.status === 'DEVELOPED').length;
  const available = territories.filter((t) => t.status === 'AVAILABLE').length;
  const totalPopulation = territories.reduce((sum, t) => sum + t.population, 0);

  return {
    totalTerritories: total,
    developedPercentage: total > 0 ? (developed / total) * 100 : 0,
    availableForExpansion: available,
    totalPopulationCoverage: totalPopulation,
  };
}

/**
 * Analyze candidate acquisition costs
 */
export function analyzeCandidateAcquisition(
  candidates: Array<{ stage: string; createdAt: Date; source: string }>,
  marketingSpend: number,
): {
  costPerLead: number;
  costPerQualified: number;
  costPerSigned: number;
  bestSource: string;
} {
  const leads = candidates.filter((c) => c.stage === 'LEAD').length;
  const qualified = candidates.filter((c) => c.stage === 'QUALIFIED').length;
  const signed = candidates.filter((c) => c.stage === 'SIGNED').length;

  // Analyze source effectiveness
  const sourcePerformance = new Map<string, number>();
  for (const candidate of candidates) {
    if (candidate.stage === 'SIGNED') {
      sourcePerformance.set(
        candidate.source,
        (sourcePerformance.get(candidate.source) || 0) + 1,
      );
    }
  }

  const bestSource = Array.from(sourcePerformance.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'UNKNOWN';

  return {
    costPerLead: leads > 0 ? marketingSpend / leads : 0,
    costPerQualified: qualified > 0 ? marketingSpend / qualified : 0,
    costPerSigned: signed > 0 ? marketingSpend / signed : 0,
    bestSource,
  };
}

/**
 * Calculate development velocity metrics
 */
export function calculateDevelopmentVelocity(
  units: Array<{
    signedDate: Date;
    scheduledOpenDate: Date;
    actualOpenDate?: Date;
  }>,
): {
  averageDaysToOpen: number;
  medianDaysToOpen: number;
  onTimeRate: number;
  unitsPerMonth: number;
} {
  const completed = units.filter((u) => u.actualOpenDate);
  
  if (completed.length === 0) {
    return {
      averageDaysToOpen: 0,
      medianDaysToOpen: 0,
      onTimeRate: 0,
      unitsPerMonth: 0,
    };
  }

  const daysToOpen = completed.map((u) => 
    Math.ceil(
      ((u.actualOpenDate!.getTime() - u.signedDate.getTime()) / (1000 * 60 * 60 * 24)),
    ),
  );

  const average = daysToOpen.reduce((sum, days) => sum + days, 0) / daysToOpen.length;

  // Calculate median
  const sorted = [...daysToOpen].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];

  // On-time rate (opened within 14 days of scheduled)
  const onTime = completed.filter((u) => {
    const variance = Math.abs(
      u.actualOpenDate!.getTime() - u.scheduledOpenDate.getTime(),
    ) / (1000 * 60 * 60 * 24);
    return variance <= 14;
  }).length;

  // Units per month (based on completed units timespan)
  const firstOpen = Math.min(...completed.map((u) => u.actualOpenDate!.getTime()));
  const lastOpen = Math.max(...completed.map((u) => u.actualOpenDate!.getTime()));
  const monthsSpan = (lastOpen - firstOpen) / (1000 * 60 * 60 * 24 * 30);
  const unitsPerMonth = monthsSpan > 0 ? completed.length / monthsSpan : 0;

  return {
    averageDaysToOpen: average,
    medianDaysToOpen: median,
    onTimeRate: (onTime / completed.length) * 100,
    unitsPerMonth,
  };
}

/**
 * Project future unit openings based on pipeline
 */
export function projectUnitOpenings(
  developmentAgreements: Array<{
    unitsCommitted: number;
    developmentSchedule: Array<{ targetOpenDate: Date }>;
  }>,
  historicalOnTimeRate: number,
): Array<{
  month: string;
  projected: number;
  adjusted: number;
}> {
  const projections = new Map<string, number>();

  // Aggregate scheduled openings by month
  for (const agreement of developmentAgreements) {
    for (const unit of agreement.developmentSchedule) {
      const monthKey = `${unit.targetOpenDate.getFullYear()}-${String(unit.targetOpenDate.getMonth() + 1).padStart(2, '0')}`;
      projections.set(monthKey, (projections.get(monthKey) || 0) + 1);
    }
  }

  // Apply historical on-time rate adjustment
  const adjustmentFactor = historicalOnTimeRate / 100;

  return Array.from(projections.entries())
    .map(([month, projected]) => ({
      month,
      projected,
      adjusted: Math.round(projected * adjustmentFactor),
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

/**
 * Identify development bottlenecks
 */
export function identifyBottlenecks(
  checklists: Array<{
    stage: string;
    daysInStage: number;
    completionPercentage: number;
  }>,
): Array<{
  stage: string;
  averageDays: number;
  delayRisk: 'HIGH' | 'MEDIUM' | 'LOW';
}> {
  const stageMetrics = new Map<string, number[]>();

  // Group by stage
  for (const checklist of checklists) {
    if (!stageMetrics.has(checklist.stage)) {
      stageMetrics.set(checklist.stage, []);
    }
    stageMetrics.get(checklist.stage)!.push(checklist.daysInStage);
  }

  // Calculate averages and identify risks
  const bottlenecks = Array.from(stageMetrics.entries()).map(([stage, days]) => {
    const averageDays = days.reduce((sum, d) => sum + d, 0) / days.length;
    
    let delayRisk: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    if (averageDays > 90) delayRisk = 'HIGH';
    else if (averageDays > 60) delayRisk = 'MEDIUM';

    return { stage, averageDays, delayRisk };
  });

  return bottlenecks.sort((a, b) => b.averageDays - a.averageDays);
}

/**
 * Calculate ROI for franchise development program
 */
export function calculateProgramROI(
  developmentFees: number,
  projectedRoyalties: number,
  programCosts: {
    marketing: number;
    personnel: number;
    technology: number;
    operations: number;
  },
  yearsToProject: number = 5,
): {
  totalInvestment: number;
  totalReturn: number;
  roi: number;
  paybackMonths: number;
} {
  const totalCosts = Object.values(programCosts).reduce((sum, cost) => sum + cost, 0);
  const annualRevenue = developmentFees + projectedRoyalties;
  const totalReturn = annualRevenue * yearsToProject;
  const totalInvestment = totalCosts * yearsToProject;

  const roi = totalInvestment > 0 ? ((totalReturn - totalInvestment) / totalInvestment) * 100 : 0;

  // Calculate payback period in months
  const monthlyRevenue = annualRevenue / 12;
  const monthlyCosts = totalCosts / 12;
  const monthlyNetIncome = monthlyRevenue - monthlyCosts;
  const paybackMonths = monthlyNetIncome > 0 ? totalCosts / monthlyNetIncome : 0;

  return {
    totalInvestment,
    totalReturn,
    roi,
    paybackMonths,
  };
}

