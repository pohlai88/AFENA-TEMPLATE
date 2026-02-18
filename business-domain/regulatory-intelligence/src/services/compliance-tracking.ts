import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface Regulation {
  id: string;
  jurisdiction: string;
  category: 'FOOD_SAFETY' | 'LABOR' | 'ENVIRONMENTAL' | 'TAX' | 'FINANCIAL' | 'DATA_PRIVACY';
  title: string;
  effectiveDate: Date;
  description: string;
  impactLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  complianceDeadline?: Date;
  status: 'MONITORING' | 'ASSESSING' | 'IMPLEMENTING' | 'COMPLIANT';
}

export async function trackRegulation(
  db: NeonHttpDatabase,
  data: Omit<Regulation, 'id' | 'status'>,
): Promise<Regulation> {
  // TODO: Insert into database with MONITORING status
  throw new Error('Database integration pending');
}

export async function getRegulations(
  db: NeonHttpDatabase,
  filters: { jurisdiction?: string; category?: string; status?: string },
): Promise<Regulation[]> {
  // TODO: Query database with filters
  throw new Error('Database integration pending');
}

export function assessComplianceRisk(
  regulation: Regulation,
  currentPractices: Array<{ practice: string; compliant: boolean }>,
): {
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  gaps: string[];
  actions: Array<{ action: string; priority: 'IMMEDIATE' | 'HIGH' | 'MEDIUM' }>;
} {
  const gaps = currentPractices
    .filter((p) => !p.compliant)
    .map((p) => p.practice);

  const actions: Array<{ action: string; priority: 'IMMEDIATE' | 'HIGH' | 'MEDIUM' }> = [];

  // Determine risk level
  let riskLevel = regulation.impactLevel;

  // Check deadline urgency
  if (regulation.complianceDeadline) {
    const daysUntilDeadline = Math.ceil(
      (regulation.complianceDeadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );

    if (gaps.length > 0) {
      if (daysUntilDeadline < 30) {
        riskLevel = 'CRITICAL';
        actions.push({
          action: 'Immediate gap remediation required',
          priority: 'IMMEDIATE',
        });
      } else if (daysUntilDeadline < 90) {
        actions.push({
          action: 'Develop compliance plan within 2 weeks',
          priority: 'HIGH',
        });
      } else {
        actions.push({
          action: 'Include in quarterly compliance review',
          priority: 'MEDIUM',
        });
      }
    }
  }

  return { riskLevel, gaps, actions };
}

export function generateComplianceReport(
  regulations: Regulation[],
): {
  summary: {
    total: number;
    compliant: number;
    inProgress: number;
    atRisk: number;
  };
  byCategory: Record<string, { total: number; compliant: number }>;
  urgentActions: Array<{ regulation: string; deadline: Date; action: string }>;
} {
  const summary = {
    total: regulations.length,
    compliant: regulations.filter((r) => r.status === 'COMPLIANT').length,
    inProgress: regulations.filter(
      (r) => r.status === 'IMPLEMENTING' || r.status === 'ASSESSING',
    ).length,
    atRisk: 0,
  };

  const byCategory = regulations.reduce(
    (acc, r) => {
      if (!acc[r.category]) {
        acc[r.category] = { total: 0, compliant: 0 };
      }
      acc[r.category].total++;
      if (r.status === 'COMPLIANT') {
        acc[r.category].compliant++;
      }
      return acc;
    },
    {} as Record<string, { total: number; compliant: number }>,
  );

  const urgentActions = regulations
    .filter((r) => r.complianceDeadline && r.status !== 'COMPLIANT')
    .filter((r) => {
      const daysUntil = Math.ceil(
        (r.complianceDeadline!.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      );
      return daysUntil < 60;
    })
    .map((r) => ({
      regulation: r.title,
      deadline: r.complianceDeadline!,
      action: r.status === 'MONITORING' ? 'Begin assessment' : 'Accelerate implementation',
    }));

  summary.atRisk = urgentActions.length;

  return { summary, byCategory, urgentActions };
}
