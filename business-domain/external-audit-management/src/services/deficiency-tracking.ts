/**
 * Deficiency Tracking Service
 * 
 * Track and remediate control deficiencies identified during audits
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';
import type { ControlDeficiency } from '../types/common.js';
import { controlDeficiencySchema, DeficiencyLevel } from '../types/common.js';

// ── Schemas ────────────────────────────────────────────────────────

export const createDeficiencySchema = controlDeficiencySchema.omit({ id: true });

export const updateRemediationSchema = z.object({
  remediationPlan: z.string().min(50),
  responsibleParty: z.string(),
  targetRemediationDate: z.coerce.date(),
  status: z.enum(['IN_REMEDIATION', 'REMEDIATED']),
});

// ── Types ──────────────────────────────────────────────────────────

export type CreateDeficiencyInput = z.infer<typeof createDeficiencySchema>;
export type UpdateRemediationInput = z.infer<typeof updateRemediationSchema>;

// ── Functions ──────────────────────────────────────────────────────

/**
 * Create control deficiency
 */
export async function createControlDeficiency(
  db: NeonHttpDatabase,
  orgId: string,
  input: CreateDeficiencyInput,
): Promise<ControlDeficiency> {
  const validated = createDeficiencySchema.parse(input);

  // TODO: Implement database logic
  // 1. Create deficiency record
  // 2. Send notification to responsible party
  // 3. If Material Weakness, escalate to CFO/Audit Committee
  // 4. Return deficiency

  throw new Error('Not implemented');
}

/**
 * Update remediation plan
 */
export async function updateRemediationPlan(
  db: NeonHttpDatabase,
  orgId: string,
  deficiencyId: string,
  input: UpdateRemediationInput,
): Promise<ControlDeficiency> {
  const validated = updateRemediationSchema.parse(input);

  // TODO: Implement database logic
  // 1. Get deficiency
  // 2. Update remediation details
  // 3. Update status
  // 4. Send notifications
  // 5. Return updated deficiency

  throw new Error('Not implemented');
}

/**
 * Get all deficiencies for audit engagement
 */
export async function getControlDeficiencies(
  db: NeonHttpDatabase,
  orgId: string,
  auditEngagementId: string,
  filters?: {
    deficiencyLevel?: DeficiencyLevel;
    status?: 'OPEN' | 'IN_REMEDIATION' | 'REMEDIATED' | 'ACCEPTED_RISK';
  },
): Promise<ControlDeficiency[]> {
  // TODO: Implement database query

  throw new Error('Not implemented');
}

/**
 * Get material weaknesses summary
 */
export async function getMaterialWeaknesses(
  db: NeonHttpDatabase,
  orgId: string,
): Promise<{
  current: ControlDeficiency[];
  remediated: ControlDeficiency[];
  overdue: ControlDeficiency[];
  summary: string;
}> {
  // TODO: Implement database query
  // 1. Get all material weaknesses
  // 2. Categorize by status
  // 3. Identify overdue remediations
  // 4. Generate summary for disclosures
  // 5. Return categorized deficiencies

  throw new Error('Not implemented');
}

/**
 * Mark deficiency as remediated
 */
export async function markDeficiencyRemediated(
  db: NeonHttpDatabase,
  orgId: string,
  deficiencyId: string,
  evidence: {
    remediationDescription: string;
    evidenceUrls: string[];
    testedBy: string;
    testedDate: Date;
  },
): Promise<ControlDeficiency> {
  // TODO: Implement database logic
  // 1. Get deficiency
  // 2. Validate remediation evidence
  // 3Update status to REMEDIATED
  // 4. Store evidence
  // 5. Send notification to auditors for verification
  // 6. Return updated deficiency

  throw new Error('Not implemented');
}

/**
 * Generate management letter text for deficiencies
 */
export function generateManagementLetterText(deficiencies: ControlDeficiency[]): string {
  const materialWeaknesses = deficiencies.filter(
    d => d.deficiencyLevel === DeficiencyLevel.MATERIAL_WEAKNESS,
  );
  const significantDeficiencies = deficiencies.filter(
    d => d.deficiencyLevel === DeficiencyLevel.SIGNIFICANT_DEFICIENCY,
  );
  const controlDeficiencies = deficiencies.filter(
    d => d.deficiencyLevel === DeficiencyLevel.CONTROL_DEFICIENCY,
  );

  let text = '';

  if (materialWeaknesses.length > 0) {
    text += `## Material Weaknesses in Internal Control Over Financial Reporting\n\n`;
    text += `We identified the following material weaknesses:\n\n`;
    for (const [index, mw] of materialWeaknesses.entries()) {
      text += `${index + 1}. ${mw.description}\n`;
      text += `   Impact: ${mw.impact}\n\n`;
    }
  }

  if (significantDeficiencies.length > 0) {
    text += `## Significant Deficiencies in Internal Control\n\n`;
    text += `We identified the following significant deficiencies:\n\n`;
    for (const [index, sd] of significantDeficiencies.entries()) {
      text += `${index + 1}. ${sd.description}\n`;
      text += `   Impact: ${sd.impact}\n\n`;
    }
  }

  if (controlDeficiencies.length > 0) {
    text += `## Other Control Deficiencies\n\n`;
    text += `We identified ${controlDeficiencies.length} other control deficiencies. See attached detailed listing.\n\n`;
  }

  return text;
}

/**
 * Calculate deficiency metrics
 */
export function calculateDeficiencyMetrics(deficiencies: ControlDeficiency[]): {
  totalCount: number;
  byLevel: Record<DeficiencyLevel, number>;
  byStatus: Record<string, number>;
  remediationRate: number;
  overdueCount: number;
  averageDaysToRemediate: number;
} {
  const now = new Date();
  const byLevel: Record<DeficiencyLevel, number> = {
    [DeficiencyLevel.MATERIAL_WEAKNESS]: 0,
    [DeficiencyLevel.SIGNIFICANT_DEFICIENCY]: 0,
    [DeficiencyLevel.CONTROL_DEFICIENCY]: 0,
  };

  const byStatus: Record<string, number> = {
    OPEN: 0,
    IN_REMEDIATION: 0,
    REMEDIATED: 0,
    ACCEPTED_RISK: 0,
  };

  let overdue = 0;
  let remediatedCount = 0;
  let totalDaysToRemediate = 0;

  for (const deficiency of deficiencies) {
    byLevel[deficiency.deficiencyLevel]++;
    byStatus[deficiency.status]++;

    if (deficiency.status === 'REMEDIATED') {
      remediatedCount++;
      // Calculate days if we have both dates
      if (deficiency.targetRemediationDate) {
        const days = Math.floor(
          (new Date(deficiency.targetRemediationDate).getTime() -
            new Date(deficiency.identifiedDate).getTime()) /
            (1000 * 60 * 60 * 24),
        );
        totalDaysToRemediate += days;
      }
    }

    if (
      deficiency.targetRemediationDate &&
      new Date(deficiency.targetRemediationDate) < now &&
      deficiency.status !== 'REMEDIATED'
    ) {
      overdue++;
    }
  }

  return {
    totalCount: deficiencies.length,
    byLevel,
    byStatus,
    remediationRate: deficiencies.length > 0 ? (remediatedCount / deficiencies.length) * 100 : 0,
    overdueCount: overdue,
    averageDaysToRemediate: remediatedCount > 0 ? totalDaysToRemediate / remediatedCount : 0,
  };
}

/**
 * Assess SOX 404 compliance status
 */
export function assessSOX404Compliance(deficiencies: ControlDeficiency[]): {
  isCompliant: boolean;
  hasMaterialWeaknesses: boolean;
  requiresDisclosure: boolean;
  summary: string;
} {
  const materialWeaknesses = deficiencies.filter(
    d => d.deficiencyLevel === DeficiencyLevel.MATERIAL_WEAKNESS && d.status !== 'REMEDIATED',
  );

  const significantDeficiencies = deficiencies.filter(
    d => d.deficiencyLevel === DeficiencyLevel.SIGNIFICANT_DEFICIENCY && d.status !== 'REMEDIATED',
  );

  const hasMaterialWeaknesses = materialWeaknesses.length > 0;
  const isCompliant = !hasMaterialWeaknesses;
  const requiresDisclosure = hasMaterialWeaknesses || significantDeficiencies.length > 0;

  let summary = '';
  if (isCompliant) {
    summary = 'Management has concluded that internal control over financial reporting is effective as of the assessment date.';
  } else {
    summary = `Management has identified ${materialWeaknesses.length} material weakness(es) in internal control over financial reporting as of the assessment date. Internal control over financial reporting is NOT effective.`;
  }

  return {
    isCompliant,
    hasMaterialWeaknesses,
    requiresDisclosure,
    summary,
  };
}

