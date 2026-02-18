import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { CIPriority, ContinuousImprovement } from '../types/common.js';

/**
 * Create a continuous improvement initiative
 */
export async function createInitiative(
  db: NeonHttpDatabase,
  data: Omit<ContinuousImprovement, 'id' | 'createdAt' | 'status'>,
): Promise<ContinuousImprovement> {
  // TODO: Insert into database with PLANNING status
  // INSERT INTO continuous_improvement (title, description, priority, target_kpi, ...)
  throw new Error('Database integration pending');
}

/**
 * Get active initiatives
 */
export async function getActiveInitiatives(
  db: NeonHttpDatabase,
  outletId?: string,
): Promise<ContinuousImprovement[]> {
  // TODO: Query database for initiatives not in COMPLETED/CANCELLED status
  throw new Error('Database integration pending');
}

/**
 * Update initiative progress
 */
export async function updateProgress(
  db: NeonHttpDatabase,
  initiativeId: string,
  currentValue: number,
  notes?: string,
): Promise<ContinuousImprovement> {
  // TODO: Update current_value and calculate progress percentage
  // UPDATE continuous_improvement SET current_value = $1, updated_at = NOW()
  throw new Error('Database integration pending');
}

/**
 * Complete an initiative
 */
export async function completeInitiative(
  db: NeonHttpDatabase,
  initiativeId: string,
  finalValue: number,
  outcomes: string,
): Promise<ContinuousImprovement> {
  // TODO: Update initiative to COMPLETED status
  // UPDATE continuous_improvement SET status = 'COMPLETED', completed_at = NOW(), ...
  throw new Error('Database integration pending');
}

/**
 * Calculate improvement percentage
 */
export function calculateImprovement(
  baselineValue: number,
  currentValue: number,
  targetValue: number,
): {
  improvement: number;
  percentImprovement: number;
  progressToTarget: number;
} {
  const improvement = currentValue - baselineValue;
  const percentImprovement =
    baselineValue !== 0 ? (improvement / baselineValue) * 100 : 0;

  const totalNeeded = targetValue - baselineValue;
  const progressToTarget =
    totalNeeded !== 0 ? ((currentValue - baselineValue) / totalNeeded) * 100 : 0;

  return {
    improvement,
    percentImprovement,
    progressToTarget: Math.min(100, Math.max(0, progressToTarget)),
  };
}

/**
 * Prioritize initiatives using value vs effort matrix
 */
export function prioritizeInitiatives(
  initiatives: Array<ContinuousImprovement & {
    estimatedEffort: number;
    estimatedValue: number;
  }>,
): Array<{
  initiative: ContinuousImprovement;
  score: number;
  quadrant: 'QUICK_WIN' | 'STRATEGIC' | 'FILL_IN' | 'AVOID';
}> {
  const avgEffort =
    initiatives.reduce((sum, i) => sum + i.estimatedEffort, 0) / initiatives.length;
  const avgValue =
    initiatives.reduce((sum, i) => sum + i.estimatedValue, 0) / initiatives.length;

  return initiatives
    .map((initiative) => {
      const score = initiative.estimatedValue / initiative.estimatedEffort;
      let quadrant: 'QUICK_WIN' | 'STRATEGIC' | 'FILL_IN' | 'AVOID' = 'FILL_IN';

      if (initiative.estimatedValue >= avgValue) {
        quadrant =
          initiative.estimatedEffort <= avgEffort ? 'QUICK_WIN' : 'STRATEGIC';
      } else {
        quadrant = initiative.estimatedEffort <= avgEffort ? 'FILL_IN' : 'AVOID';
      }

      return { initiative, score, quadrant };
    })
    .sort((a, b) => b.score - a.score);
}

/**
 * Generate PDCA (Plan-Do-Check-Act) cycle report
 */
export function generatePDCAReport(
  initiative: ContinuousImprovement,
  checkData: {
    metrics: Array<{ name: string; value: number; target: number }>;
    observations: string[];
  },
): {
  plan: string;
  do: string;
  check: {
    metricsStatus: Array<{
      name: string;
      achieved: boolean;
      variance: number;
    }>;
    observationsSummary: string;
  };
  act: string[];
} {
  const metricsStatus = checkData.metrics.map((metric) => ({
    name: metric.name,
    achieved: metric.value >= metric.target,
    variance: ((metric.value - metric.target) / metric.target) * 100,
  }));

  const allAchieved = metricsStatus.every((m) => m.achieved);
  const actRecommendations: string[] = [];

  if (allAchieved) {
    actRecommendations.push('Standardize successful practices');
    actRecommendations.push('Share best practices with other outlets');
    actRecommendations.push('Set new improvement targets');
  } else {
    const underperforming = metricsStatus.filter((m) => !m.achieved);
    actRecommendations.push(`Address ${underperforming.length} underperforming metric(s)`);
    actRecommendations.push('Analyze root causes of gaps');
    actRecommendations.push('Adjust action plans as needed');
  }

  return {
    plan: initiative.actionPlan || 'No action plan documented',
    do: `Implementation started: ${initiative.startDate || 'TBD'}`,
    check: {
      metricsStatus,
      observationsSummary: `${checkData.observations.length} observation(s) recorded`,
    },
    act: actRecommendations,
  };
}

/**
 * Track initiative ROI
 */
export function calculateInitiativeROI(
  initiative: ContinuousImprovement,
  costOfImplementation: number,
  annualBenefit: number,
): {
  roi: number;
  paybackPeriod: number;
  npv: number;
  recommendation: string;
} {
  const roi = costOfImplementation > 0 ? (annualBenefit / costOfImplementation) * 100 : 0;
  const paybackPeriod = annualBenefit > 0 ? costOfImplementation / annualBenefit : Infinity;

  // Simple NPV calculation (3-year horizon, 10% discount rate)
  const discountRate = 0.1;
  let npv = -costOfImplementation;
  for (let year = 1; year <= 3; year++) {
    npv += annualBenefit / Math.pow(1 + discountRate, year);
  }

  let recommendation = '';
  if (roi >= 200) {
    recommendation = 'Highly recommended. Excellent ROI expected.';
  } else if (roi >= 100) {
    recommendation = 'Recommended. Good ROI expected.';
  } else if (roi >= 50) {
    recommendation = 'Consider. Moderate ROI expected.';
  } else {
    recommendation = 'Reevaluate. Low ROI. Focus on strategic value.';
  }

  return { roi, paybackPeriod, npv, recommendation };
}

/**
 * Generate improvement dashboard
 */
export function generateImprovementDashboard(
  initiatives: ContinuousImprovement[],
): {
  totalInitiatives: number;
  byStatus: Record<string, number>;
  byPriority: Record<CIPriority, number>;
  avgProgress: number;
  onTrack: number;
  atRisk: number;
} {
  const dashboard = {
    totalInitiatives: initiatives.length,
    byStatus: {} as Record<string, number>,
    byPriority: {
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
    } as Record<CIPriority, number>,
    avgProgress: 0,
    onTrack: 0,
    atRisk: 0,
  };

  let totalProgress = 0;

  for (const initiative of initiatives) {
    // Count by status
    dashboard.byStatus[initiative.status] =
      (dashboard.byStatus[initiative.status] || 0) + 1;

    // Count by priority
    dashboard.byPriority[initiative.priority]++;

    // Calculate progress
    const progress = calculateImprovement(
      initiative.baselineValue,
      initiative.currentValue,
      initiative.targetValue,
    );
    totalProgress += progress.progressToTarget;

    // Risk assessment
    if (
      initiative.targetDate &&
      new Date(initiative.targetDate).getTime() < Date.now()
    ) {
      dashboard.atRisk++;
    } else if (progress.progressToTarget >= 75) {
      dashboard.onTrack++;
    } else if (progress.progressToTarget < 25) {
      dashboard.atRisk++;
    } else {
      dashboard.onTrack++;
    }
  }

  dashboard.avgProgress =
    initiatives.length > 0 ? totalProgress / initiatives.length : 0;

  return dashboard;
}

/**
 * Identify improvement opportunities from audit data
 */
export function identifyImprovementOpportunities(
  auditScores: Array<{ category: string; score: number; maxScore: number }>,
): Array<{
  category: string;
  currentPerformance: number;
  gapToTarget: number;
  priority: CIPriority;
  suggestedActions: string[];
}> {
  return auditScores
    .map((audit) => {
      const currentPerformance = (audit.score / audit.maxScore) * 100;
      const gapToTarget = 100 - currentPerformance;

      let priority: CIPriority = 'LOW';
      const suggestedActions: string[] = [];

      if (currentPerformance < 70) {
        priority = 'HIGH';
        suggestedActions.push('Immediate intervention required');
        suggestedActions.push('Assign dedicated resource');
        suggestedActions.push('Weekly progress reviews');
      } else if (currentPerformance < 85) {
        priority = 'MEDIUM';
        suggestedActions.push('Develop improvement plan');
        suggestedActions.push('Monthly monitoring');
      } else {
        priority = 'LOW';
        suggestedActions.push('Maintain current standards');
        suggestedActions.push('Quarterly review');
      }

      return {
        category: audit.category,
        currentPerformance,
        gapToTarget,
        priority,
        suggestedActions,
      };
    })
    .sort((a, b) => b.gapToTarget - a.gapToTarget);
}

