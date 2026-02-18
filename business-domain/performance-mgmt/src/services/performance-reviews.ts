import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface PerformanceReview {
  id: string;
  orgId: string;
  employeeId: string;
  reviewerId: string;
  reviewPeriodStart: Date;
  reviewPeriodEnd: Date;
  reviewType: 'ANNUAL' | 'QUARTERLY' | 'PROBATIONARY' | 'PROJECT';
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'COMPLETED';
  overallRating?: number; // 1-5
  strengths?: string;
  areasForImprovement?: string;
  goals?: string[];
  submittedDate?: Date;
}

export interface PerformanceGoal {
  id: string;
  employeeId: string;
  goalTitle: string;
  description: string;
  category: 'INDIVIDUAL' | 'TEAM' | 'COMPANY';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  targetDate: Date;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  progress: number; // 0-100
  measurementCriteria?: string;
}

export async function createPerformanceReview(
  db: NeonHttpDatabase,
  data: Omit<PerformanceReview, 'id' | 'status'>,
): Promise<PerformanceReview> {
  // TODO: Insert performance review with NOT_STARTED status
  throw new Error('Database integration pending');
}

export async function submitReview(
  db: NeonHttpDatabase,
  reviewId: string,
  overallRating: number,
  strengths: string,
  areasForImprovement: string,
): Promise<PerformanceReview> {
  // TODO: Update review with ratings and change status to SUBMITTED
  throw new Error('Database integration pending');
}

export async function createGoal(
  db: NeonHttpDatabase,
  data: Omit<PerformanceGoal, 'id' | 'status' | 'progress'>,
): Promise<PerformanceGoal> {
  // TODO: Insert goal with NOT_STARTED status and 0 progress
  throw new Error('Database integration pending');
}

export async function updateGoalProgress(
  db: NeonHttpDatabase,
  goalId: string,
  progress: number,
): Promise<PerformanceGoal> {
  // TODO: Update goal progress and status
  throw new Error('Database integration pending');
}

export function calculatePerformanceDistribution(
  reviews: PerformanceReview[],
): { rating: number; count: number; percentage: number }[] {
  const distribution = new Map<number, number>();

  for (const review of reviews) {
    if (review.overallRating) {
      distribution.set(review.overallRating, (distribution.get(review.overallRating) || 0) + 1);
    }
  }

  const total = reviews.filter((r) => r.overallRating).length;

  return Array.from(distribution.entries())
    .map(([rating, count]) => ({
      rating,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }))
    .sort((a, b) => a.rating - b.rating);
}

export function identifyHighPerformers(
  reviews: PerformanceReview[],
  threshold: number = 4.5,
): PerformanceReview[] {
  return reviews.filter((review) => review.overallRating && review.overallRating >= threshold);
}

export function calculateGoalCompletionRate(
  goals: PerformanceGoal[],
): { completionRate: number; onTrackRate: number; atRiskRate: number } {
  const total = goals.length;
  const completed = goals.filter((g) => g.status === 'COMPLETED').length;
  const onTrack = goals.filter((g) => {
    if (g.status === 'COMPLETED') return false;
    const daysRemaining = Math.floor((g.targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return g.progress >= 50 || daysRemaining > 30;
  }).length;
  const atRisk = total - completed - onTrack;

  return {
    completionRate: total > 0 ? (completed / total) * 100 : 0,
    onTrackRate: total > 0 ? (onTrack / total) * 100 : 0,
    atRiskRate: total > 0 ? (atRisk / total) * 100 : 0,
  };
}

export function generatePerformanceReport(
  employee: { id: string; name: string },
  reviews: PerformanceReview[],
  goals: PerformanceGoal[],
): {
  employeeId: string;
  avgRating: number;
  reviewCount: number;
  goalsCompleted: number;
  goalsTotal: number;
  improvementTrend: 'IMPROVING' | 'STABLE' | 'DECLINING';
} {
  const avgRating = reviews.reduce((sum, r) => sum + (r.overallRating || 0), 0) / reviews.length || 0;
  const goalsCompleted = goals.filter((g) => g.status === 'COMPLETED').length;

  // Calculate trend from last 3 reviews
  const recent = reviews.slice(-3);
  let trend: 'IMPROVING' | 'STABLE' | 'DECLINING' = 'STABLE';
  if (recent.length >= 2) {
    const oldAvg = recent[0].overallRating || 0;
    const newAvg = recent[recent.length - 1].overallRating || 0;
    if (newAvg > oldAvg + 0.5) trend = 'IMPROVING';
    else if (newAvg < oldAvg - 0.5) trend = 'DECLINING';
  }

  return {
    employeeId: employee.id,
    avgRating,
    reviewCount: reviews.length,
    goalsCompleted,
    goalsTotal: goals.length,
    improvementTrend: trend,
  };
}
