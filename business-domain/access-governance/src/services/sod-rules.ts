import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const CreateSoDRuleParams = z.object({
  ruleName: z.string(),
  description: z.string(),
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  conflictingRoles: z.array(z.string()).optional(),
  conflictingPermissions: z.array(z.string()).optional(),
  remediation: z.string(),
});

export interface SoDRule {
  ruleId: string;
  ruleName: string;
  description: string;
  severity: string;
  conflictingRoles: string[];
  conflictingPermissions: string[];
  remediation: string;
  active: boolean;
  createdAt: Date;
}

export async function createSoDRule(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof CreateSoDRuleParams>,
): Promise<Result<SoDRule>> {
  const validated = CreateSoDRuleParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Create SoD rule
  return ok({
    ruleId: `sod-${Date.now()}`,
    ruleName: validated.data.ruleName,
    description: validated.data.description,
    severity: validated.data.severity,
    conflictingRoles: validated.data.conflictingRoles ?? [],
    conflictingPermissions: validated.data.conflictingPermissions ?? [],
    remediation: validated.data.remediation,
    active: true,
    createdAt: new Date(),
  });
}

const EvaluateSoDRulesParams = z.object({
  userId: z.string(),
  proposedRoleIds: z.array(z.string()).optional(),
  proposedPermissions: z.array(z.string()).optional(),
});

export interface SoDEvaluation {
  userId: string;
  hasViolations: boolean;
  violations: Array<{
    ruleId: string;
    ruleName: string;
    severity: string;
    description: string;
    conflictingItems: string[];
    remediation: string;
  }>;
  riskScore: number;
}

export async function evaluateSoDRules(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof EvaluateSoDRulesParams>,
): Promise<Result<SoDEvaluation>> {
  const validated = EvaluateSoDRulesParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Evaluate SoD rules against user's current and proposed access
  return ok({
    userId: validated.data.userId,
    hasViolations: false,
    violations: [],
    riskScore: 0,
  });
}

const GetSoDViolationsParams = z.object({
  severity: z.enum(['critical', 'high', 'medium', 'low']).optional(),
  includeResolved: z.boolean().optional(),
});

export interface SoDViolations {
  violations: Array<{
    violationId: string;
    userId: string;
    ruleId: string;
    ruleName: string;
    severity: string;
    detectedAt: Date;
    resolvedAt?: Date;
    status: 'open' | 'mitigated' | 'accepted' | 'resolved';
  }>;
  totalViolations: number;
  bySeverity: Record<string, number>;
}

export async function getSoDViolations(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof GetSoDViolationsParams>,
): Promise<Result<SoDViolations>> {
  const validated = GetSoDViolationsParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Get active SoD violations
  return ok({
    violations: [
      {
        violationId: 'viol-001',
        userId: 'user-123',
        ruleId: 'sod-001',
        ruleName: 'No AP + Cash Disbursement',
        severity: 'critical',
        detectedAt: new Date(),
        status: 'open',
      },
    ],
    totalViolations: 1,
    bySeverity: {
      critical: 1,
      high: 0,
      medium: 0,
      low: 0,
    },
  });
}

const MitigateSoDViolationParams = z.object({
  violationId: z.string(),
  mitigationType: z.enum(['revoke_access', 'add_controls', 'accept_risk', 'other']),
  justification: z.string(),
  mitigationDetails: z.string(),
});

export interface SoDMitigation {
  violationId: string;
  mitigationType: string;
  mitigatedBy: string;
  mitigatedAt: Date;
  justification: string;
  status: 'mitigated' | 'accepted';
}

export async function mitigateSoDViolation(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof MitigateSoDViolationParams>,
): Promise<Result<SoDMitigation>> {
  const validated = MitigateSoDViolationParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Mitigate SoD violation
  return ok({
    violationId: validated.data.violationId,
    mitigationType: validated.data.mitigationType,
    mitigatedBy: userId,
    mitigatedAt: new Date(),
    justification: validated.data.justification,
    status: validated.data.mitigationType === 'accept_risk' ? 'accepted' : 'mitigated',
  });
}
