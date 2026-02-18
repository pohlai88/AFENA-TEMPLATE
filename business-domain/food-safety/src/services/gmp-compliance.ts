import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface GMPAudit {
  id: string;
  facilityId: string;
  auditDate: Date;
  auditor: string;
  standard: 'FDA_GMP' | 'EU_GMP' | 'WHO_GMP' | 'CODEX_GMP' | 'ISO_22000';
  categories: Array<{
    name: string;
    requirements: string[];
    score: number;
    maxScore: number;
    findings: string[];
  }>;
  overallScore: number;
  result: 'PASS' | 'CONDITIONAL_PASS' | 'FAIL';
  correctiveActions: string[];
  nextAuditDate: Date;
}

export interface GMPNonConformance {
  id: string;
  facilityId: string;
  category: 'PERSONNEL' | 'FACILITIES' | 'EQUIPMENT' | 'SANITATION' | 'PRODUCTION' | 'QUALITY_CONTROL';
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
  description: string;
  identifiedDate: Date;
  correctiveAction: string;
  targetDate: Date;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'VERIFIED';
  verifiedDate?: Date;
}

export async function createGMPAudit(
  db: NeonHttpDatabase,
  data: Omit<GMPAudit, 'id'>,
): Promise<GMPAudit> {
  // TODO: Insert into database
  throw new Error('Database integration pending');
}

export async function getGMPAudits(
  db: NeonHttpDatabase,
  facilityId: string,
  dateFrom?: Date,
): Promise<GMPAudit[]> {
  // TODO: Query database
  throw new Error('Database integration pending');
}

export async function recordNonConformance(
  db: NeonHttpDatabase,
  data: Omit<GMPNonConformance, 'id' | 'status'>,
): Promise<GMPNonConformance> {
  // TODO: Insert into database with OPEN status
  throw new Error('Database integration pending');
}

export async function getNonConformances(
  db: NeonHttpDatabase,
  facilityId: string,
  status?: GMPNonConformance['status'],
): Promise<GMPNonConformance[]> {
  // TODO: Query database with optional status filter
  throw new Error('Database integration pending');
}

/**
 * Calculate GMP audit score and result
 */
export function calculateGMPScore(
  categories: GMPAudit['categories'],
): {
  overallScore: number;
  result: 'PASS' | 'CONDITIONAL_PASS' | 'FAIL';
  criticalFindings: number;
  majorFindings: number;
  minorFindings: number;
} {
  let totalScore = 0;
  let maxScore = 0;
  let criticalFindings = 0;
  let majorFindings = 0;
  let minorFindings = 0;

  for (const category of categories) {
    totalScore += category.score;
    maxScore += category.maxScore;

    for (const finding of category.findings) {
      if (finding.toLowerCase().includes('critical')) criticalFindings++;
      else if (finding.toLowerCase().includes('major')) majorFindings++;
      else minorFindings++;
    }
  }

  const overallScore = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

  let result: 'PASS' | 'CONDITIONAL_PASS' | 'FAIL' = 'PASS';

  // Automatic fail conditions
  if (criticalFindings > 0 || overallScore < 60) {
    result = 'FAIL';
  } else if (majorFindings > 5 || overallScore < 80) {
    result = 'CONDITIONAL_PASS';
  }

  return {
    overallScore,
    result,
    criticalFindings,
    majorFindings,
    minorFindings,
  };
}

/**
 * Generate GMP checklist based on standard
 */
export function generateGMPChecklist(
  standard: GMPAudit['standard'],
): Array<{
  category: string;
  requirements: Array<{ item: string; criticality: 'CRITICAL' | 'MAJOR' | 'MINOR' }>;
}> {
  const baseChecklist = [
    {
      category: 'Personnel',
      requirements: [
        { item: 'Personnel hygiene program documented', criticality: 'CRITICAL' as const },
        { item: 'Employee training records maintained', criticality: 'MAJOR' as const },
        { item: 'Health examination records current', criticality: 'MAJOR' as const },
        { item: 'Protective clothing provided and used', criticality: 'MAJOR' as const },
        { item: 'Hand washing facilities adequate', criticality: 'CRITICAL' as const },
      ],
    },
    {
      category: 'Facilities',
      requirements: [
        { item: 'Building design prevents contamination', criticality: 'CRITICAL' as const },
        { item: 'Adequate lighting throughout facility', criticality: 'MAJOR' as const },
        { item: 'Ventilation system adequate', criticality: 'MAJOR' as const },
        { item: 'Water supply potable and tested', criticality: 'CRITICAL' as const },
        { item: 'Waste disposal system adequate', criticality: 'MAJOR' as const },
      ],
    },
    {
      category: 'Equipment',
      requirements: [
        { item: 'Equipment designed for easy cleaning', criticality: 'MAJOR' as const },
        { item: 'Maintenance schedule documented', criticality: 'MAJOR' as const },
        { item: 'Calibration records current', criticality: 'CRITICAL' as const },
        { item: 'Equipment suitable for intended use', criticality: 'CRITICAL' as const },
      ],
    },
    {
      category: 'Sanitation',
      requirements: [
        { item: 'Sanitation SOP documented', criticality: 'CRITICAL' as const },
        { item: 'Cleaning schedule maintained', criticality: 'MAJOR' as const },
        { item: 'Pest control program active', criticality: 'CRITICAL' as const },
        { item: 'Waste management procedures followed', criticality: 'MAJOR' as const },
      ],
    },
    {
      category: 'Production',
      requirements: [
        { item: 'Raw materials inspected on receipt', criticality: 'CRITICAL' as const },
        { item: 'Production records complete', criticality: 'MAJOR' as const },
        { item: 'Batch identification system in place', criticality: 'CRITICAL' as const },
        { item: 'Process controls validated', criticality: 'CRITICAL' as const },
        { item: 'Rework procedures documented', criticality: 'MAJOR' as const },
      ],
    },
    {
      category: 'Quality Control',
      requirements: [
        { item: 'QC laboratory adequate', criticality: 'CRITICAL' as const },
        { item: 'Testing procedures validated', criticality: 'CRITICAL' as const },
        { item: 'Specifications documented', criticality: 'MAJOR' as const },
        { item: 'Sampling procedures documented', criticality: 'MAJOR' as const },
        { item: 'Records retention policy followed', criticality: 'MAJOR' as const },
      ],
    },
  ];

  // Add standard-specific requirements
  if (standard === 'FDA_GMP') {
    baseChecklist.push({
      category: 'FDA-Specific',
      requirements: [
        { item: 'Part 117 CGMP requirements met', criticality: 'CRITICAL' as const },
        { item: 'Preventive controls implemented', criticality: 'CRITICAL' as const },
      ],
    });
  } else if (standard === 'ISO_22000') {
    baseChecklist.push({
      category: 'ISO 22000',
      requirements: [
        { item: 'HACCP principles implemented', criticality: 'CRITICAL' as const },
        { item: 'Food safety management system documented', criticality: 'CRITICAL' as const },
        { item: 'Management review conducted', criticality: 'MAJOR' as const },
      ],
    });
  }

  return baseChecklist;
}

/**
 * Assess GMP compliance gap
 */
export function assessComplianceGap(
  currentPractices: Array<{ requirement: string; implemented: boolean; evidence: string }>,
  standard: GMPAudit['standard'],
): {
  complianceRate: number;
  gaps: Array<{ requirement: string; priority: 'HIGH' | 'MEDIUM' | 'LOW' }>;
  estimatedEffort: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
} {
  const implemented = currentPractices.filter((p) => p.implemented).length;
  const complianceRate = currentPractices.length > 0 
    ? (implemented / currentPractices.length) * 100 
    : 0;

  const checklist = generateGMPChecklist(standard);
  const gaps: Array<{ requirement: string; priority: 'HIGH' | 'MEDIUM' | 'LOW' }> = [];

  for (const practice of currentPractices) {
    if (!practice.implemented) {
      // Find criticality from checklist
      let priority: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';

      for (const category of checklist) {
        const req = category.requirements.find(
          (r) => r.item === practice.requirement,
        );
        if (req) {
          priority = req.criticality === 'CRITICAL' ? 'HIGH' :
                     req.criticality === 'MAJOR' ? 'MEDIUM' : 'LOW';
          break;
        }
      }

      gaps.push({ requirement: practice.requirement, priority });
    }
  }

  // Estimate effort based on number and type of gaps
  const highPriorityGaps = gaps.filter((g) => g.priority === 'HIGH').length;
  const totalGaps = gaps.length;

  let estimatedEffort: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH' = 'LOW';
  if (highPriorityGaps > 5 || totalGaps > 20) {
    estimatedEffort = 'VERY_HIGH';
  } else if (highPriorityGaps > 2 || totalGaps > 10) {
    estimatedEffort = 'HIGH';
  } else if (totalGaps > 5) {
    estimatedEffort = 'MEDIUM';
  }

  return { complianceRate, gaps, estimatedEffort };
}

/**
 * Prioritize non-conformances for resolution
 */
export function prioritizeNonConformances(
  nonConformances: GMPNonConformance[],
): Array<{
  nc: GMPNonConformance;
  priority: number;
  urgency: 'IMMEDIATE' | 'HIGH' | 'MEDIUM' | 'LOW';
}> {
  return nonConformances
    .map((nc) => {
      let priority = 0;
      let urgency: 'IMMEDIATE' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';

      // Severity scoring
      if (nc.severity === 'CRITICAL') {
        priority += 100;
        urgency = 'IMMEDIATE';
      } else if (nc.severity === 'MAJOR') {
        priority += 50;
        urgency = urgency === 'IMMEDIATE' ? urgency : 'HIGH';
      } else {
        priority += 25;
        urgency = urgency === 'IMMEDIATE' || urgency === 'HIGH' ? urgency : 'MEDIUM';
      }

      // Overdue penalty
      const daysOverdue = Math.ceil(
        (Date.now() - nc.targetDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (daysOverdue > 0) {
        priority += daysOverdue * 5;
        if (urgency === 'LOW') urgency = 'MEDIUM';
        if (urgency === 'MEDIUM') urgency = 'HIGH';
      }

      // Category weight (some categories more critical)
      if (nc.category === 'QUALITY_CONTROL' || nc.category === 'PRODUCTION') {
        priority += 10;
      }

      return { nc, priority, urgency };
    })
    .sort((a, b) => b.priority - a.priority);
}

/**
 * Generate GMP compliance dashboard
 */
export function generateGMPDashboard(data: {
  audits: GMPAudit[];
  nonConformances: GMPNonConformance[];
}): {
  currentStatus: 'COMPLIANT' | 'NEEDS_IMPROVEMENT' | 'NON_COMPLIANT';
  latestScore: number;
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  openNCCount: number;
  criticalNCCount: number;
  nextAuditDate?: Date;
  keyMetrics: {
    avgAuditScore: number;
    ncResolutionRate: number;
    avgResolutionDays: number;
  };
} {
  const sortedAudits = [...data.audits].sort(
    (a, b) => b.auditDate.getTime() - a.auditDate.getTime(),
  );

  const latestAudit = sortedAudits[0];
  const latestScore = latestAudit?.overallScore || 0;

  // Determine current status
  let currentStatus: 'COMPLIANT' | 'NEEDS_IMPROVEMENT' | 'NON_COMPLIANT' = 'NON_COMPLIANT';
  if (latestAudit?.result === 'PASS') {
    currentStatus = 'COMPLIANT';
  } else if (latestAudit?.result === 'CONDITIONAL_PASS') {
    currentStatus = 'NEEDS_IMPROVEMENT';
  }

  // Calculate trend
  let trend: 'IMPROVING' | 'STABLE' | 'DECLINING' = 'STABLE';
  if (sortedAudits.length >= 2) {
    const scoreDiff = sortedAudits[0].overallScore - sortedAudits[1].overallScore;
    if (scoreDiff > 5) trend = 'IMPROVING';
    else if (scoreDiff < -5) trend = 'DECLINING';
  }

  // NC counts
  const openNCs = data.nonConformances.filter(
    (nc) => nc.status === 'OPEN' || nc.status === 'IN_PROGRESS',
  );
  const criticalNCs = openNCs.filter((nc) => nc.severity === 'CRITICAL');

  // Key metrics
  const avgAuditScore =
    data.audits.reduce((sum, a) => sum + a.overallScore, 0) / data.audits.length || 0;

  const resolvedNCs = data.nonConformances.filter((nc) => nc.status === 'RESOLVED' || nc.status === 'VERIFIED');
  const ncResolutionRate =
    data.nonConformances.length > 0
      ? (resolvedNCs.length / data.nonConformances.length) * 100
      : 0;

  const resolutionDays = resolvedNCs
    .filter((nc) => nc.verifiedDate)
    .map((nc) =>
      Math.ceil(
        (nc.verifiedDate!.getTime() - nc.identifiedDate.getTime()) / (1000 * 60 * 60 * 24),
      ),
    );
  const avgResolutionDays =
    resolutionDays.length > 0
      ? resolutionDays.reduce((sum, days) => sum + days, 0) / resolutionDays.length
      : 0;

  return {
    currentStatus,
    latestScore,
    trend,
    openNCCount: openNCs.length,
    criticalNCCount: criticalNCs.length,
    nextAuditDate: latestAudit?.nextAuditDate,
    keyMetrics: {
      avgAuditScore,
      ncResolutionRate,
      avgResolutionDays,
    },
  };
}
