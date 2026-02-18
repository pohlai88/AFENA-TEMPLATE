import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface Innovation {
  id: string;
  title: string;
  description: string;
  submittedBy: string;
  submittedDate: Date;
  category: 'PRODUCT' | 'PROCESS' | 'SERVICE' | 'BUSINESS_MODEL';
  stage: 'IDEA' | 'EVALUATION' | 'PROTOTYPE' | 'PILOT' | 'IMPLEMENTATION' | 'REJECTED';
  potentialValue: number;
  implementationCost: number;
  votes: number;
}

export async function submitIdea(
  db: NeonHttpDatabase,
  data: Omit<Innovation, 'id' | 'submittedDate' | 'stage' | 'votes'>,
): Promise<Innovation> {
  // TODO: Insert into database with IDEA stage
  throw new Error('Database integration pending');
}

export async function getIdeas(
  db: NeonHttpDatabase,
  stage?: Innovation['stage'],
): Promise<Innovation[]> {
  // TODO: Query database with optional stage filter
  throw new Error('Database integration pending');
}

export function scoreIdea(
  idea: Innovation,
  criteria: {
    feasibility: number; // 1-10
    impact: number; // 1-10
    alignment: number; // 1-10
  },
): {
  totalScore: number;
  recommendation: 'PURSUE' | 'EVALUATE_FURTHER' | 'DECLINE';
  reasoning: string;
} {
  const totalScore =
    criteria.feasibility * 0.3 + criteria.impact * 0.4 + criteria.alignment * 0.3;

  let recommendation: 'PURSUE' | 'EVALUATE_FURTHER' | 'DECLINE' = 'EVALUATE_FURTHER';
  let reasoning = '';

  if (totalScore >= 8) {
    recommendation = 'PURSUE';
    reasoning = 'High score across all criteria. Recommend fast-track to prototype.';
  } else if (totalScore >= 6) {
    recommendation = 'EVALUATE_FURTHER';
    reasoning = 'Promising idea. Conduct feasibility study before proceeding.';
  } else {
    recommendation = 'DECLINE';
    reasoning = 'Low score. Does not meet innovation threshold.';
  }

  return { totalScore, recommendation, reasoning };
}

export function calculateROI(
  potentialValue: number,
  implementationCost: number,
  timeframe: number, // months
): {
  roi: number;
  paybackPeriod: number;
  recommendation: string;
} {
  const roi = implementationCost > 0 ? (potentialValue / implementationCost - 1) * 100 : 0;
  const monthlyValue = potentialValue / 12;
  const paybackPeriod = monthlyValue > 0 ? implementationCost / monthlyValue : Infinity;

  let recommendation = '';
  if (roi >= 200 && paybackPeriod <= 12) {
    recommendation = 'Excellent investment. Prioritize for implementation.';
  } else if (roi >= 100 && paybackPeriod <= 24) {
    recommendation = 'Good investment. Include in innovation portfolio.';
  } else if (roi >= 50) {
    recommendation = 'Moderate return. Consider strategic value beyond ROI.';
  } else {
    recommendation = 'Low financial return. Reevaluate business case.';
  }

  return { roi, paybackPeriod, recommendation };
}
