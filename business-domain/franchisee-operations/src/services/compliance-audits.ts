import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { ComplianceAudit, AuditStatus } from '../types/common.js';

export async function scheduleAudit(
  db: NeonHttpDatabase,
  orgId: string,
  unitId: string,
  auditDate: Date,
): Promise<ComplianceAudit> {
  throw new Error('Database integration pending');
}

export async function completeAudit(
  db: NeonHttpDatabase,
  auditId: string,
  scores: { brandScore: number; healthScore: number },
  findings: string[],
): Promise<ComplianceAudit> {
  throw new Error('Database integration pending');
}

export function determineAuditFrequency(recentScores: number[]): {
  recommended: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  reason: string;
} {
  if (recentScores.length === 0) return { recommended: 'QUARTERLY', reason: 'No history' };
  const avg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
  if (avg < 70) return { recommended: 'MONTHLY', reason: 'Low scores require oversight' };
  if (avg < 85) return { recommended: 'QUARTERLY', reason: 'Standard compliance rhythm' };
  return { recommended: 'ANNUAL', reason: 'Excellent performance' };
}

