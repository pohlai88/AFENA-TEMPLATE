import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { AuditFinding, FindingSeverity } from '../types/common.js';

/**
 * Create a new audit finding
 */
export async function createFinding(
  db: NeonHttpDatabase,
  auditId: string,
  data: Omit<AuditFinding, 'id' | 'createdAt'>,
): Promise<AuditFinding> {
  // TODO: Insert into database
  // INSERT INTO audit_findings (audit_id, category_id, severity, description, ...)
  throw new Error('Database integration pending');
}

/**
 * Get findings for an audit
 */
export async function getAuditFindings(
  db: NeonHttpDatabase,
  auditId: string,
  severity?: FindingSeverity,
): Promise<AuditFinding[]> {
  // TODO: Query database with optional severity filter
  throw new Error('Database integration pending');
}

/**
 * Get recurring findings for an outlet
 */
export async function getRecurringFindings(
  db: NeonHttpDatabase,
  outletId: string,
  occurrenceThreshold: number = 2,
): Promise<Array<{
  finding: AuditFinding;
  occurrences: number;
  firstSeen: Date;
  lastSeen: Date;
}>> {
  // TODO: Query database for findings that appear across multiple audits
  // GROUP BY description HAVING COUNT(*) >= $threshold
  throw new Error('Database integration pending');
}

/**
 * Categorize finding severity based on impact
 */
export function categorizeSeverity(
  description: string,
  impact: {
    safety: boolean;
    brand: boolean;
    legal: boolean;
    customer: boolean;
  },
): FindingSeverity {
  // Critical: Safety or legal issues
  if (impact.safety || impact.legal) {
    return 'CRITICAL';
  }

  // Major: Brand standards or customer experience
  if (impact.brand || impact.customer) {
    return 'MAJOR';
  }

  // Minor: Operational issues
  if (description.toLowerCase().includes('maintenance') ||
      description.toLowerCase().includes('cleanliness')) {
    return 'MINOR';
  }

  // Observation: Everything else
  return 'OBSERVATION';
}

/**
 * Prioritize findings for corrective action
 */
export function prioritizeFindings(
  findings: AuditFinding[],
): Array<{
  finding: AuditFinding;
  priority: number;
  urgency: 'IMMEDIATE' | 'HIGH' | 'MEDIUM' | 'LOW';
}> {
  return findings
    .map((finding) => {
      let priority = 0;
      let urgency: 'IMMEDIATE' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';

      // Severity scoring
      if (finding.severity === 'CRITICAL') {
        priority += 100;
        urgency = 'IMMEDIATE';
      } else if (finding.severity === 'MAJOR') {
        priority += 75;
        urgency = urgency === 'IMMEDIATE' ? urgency : 'HIGH';
      } else if (finding.severity === 'MINOR') {
        priority += 50;
        urgency = urgency === 'IMMEDIATE' || urgency === 'HIGH' ? urgency : 'MEDIUM';
      } else {
        priority += 25;
      }

      // Recurring issue penalty
      if (finding.isRecurring) {
        priority += 25;
        if (urgency === 'LOW') urgency = 'MEDIUM';
        if (urgency === 'MEDIUM') urgency = 'HIGH';
      }

      return { finding, priority, urgency };
    })
    .sort((a, b) => b.priority - a.priority);
}

/**
 * Generate finding summary report
 */
export function generateFindingsSummary(
  findings: AuditFinding[],
): {
  total: number;
  bySeverity: Record<FindingSeverity, number>;
  recurring: number;
  withEvidence: number;
} {
  const summary = {
    total: findings.length,
    bySeverity: {
      CRITICAL: 0,
      MAJOR: 0,
      MINOR: 0,
      OBSERVATION: 0,
    } as Record<FindingSeverity, number>,
    recurring: 0,
    withEvidence: 0,
  };

  for (const finding of findings) {
    summary.bySeverity[finding.severity]++;
    if (finding.isRecurring) summary.recurring++;
    if (finding.evidence && finding.evidence.length > 0) summary.withEvidence++;
  }

  return summary;
}

/**
 * Identify patterns in findings across multiple audits
 */
export function identifyFindingPatterns(
  findings: AuditFinding[],
): Array<{
  pattern: string;
  frequency: number;
  severity: FindingSeverity;
  category: string;
}> {
  // Group findings by similar descriptions (simplified pattern matching)
  const patterns = new Map<string, {
    count: number;
    severity: FindingSeverity;
    category: string;
  }>();

  for (const finding of findings) {
    // Extract key words (simplified - in production use NLP)
    const keywords = finding.description
      .toLowerCase()
      .split(' ')
      .filter((word) => word.length > 4);

    for (const keyword of keywords) {
      const existing = patterns.get(keyword);
      if (existing) {
        existing.count++;
      } else {
        patterns.set(keyword, {
          count: 1,
          severity: finding.severity,
          category: finding.categoryId || 'Unknown',
        });
      }
    }
  }

  return Array.from(patterns.entries())
    .filter(([_, data]) => data.count >= 2) // Only patterns that appear 2+ times
    .map(([pattern, data]) => ({
      pattern,
      frequency: data.count,
      severity: data.severity,
      category: data.category,
    }))
    .sort((a, b) => b.frequency - a.frequency);
}

/**
 * Calculate risk score for an outlet based on findings
 */
export function calculateOutletRiskScore(
  findings: AuditFinding[],
): {
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors: string[];
} {
  let riskScore = 0;
  const factors: string[] = [];

  const summary = generateFindingsSummary(findings);

  // Critical findings
  if (summary.bySeverity.CRITICAL > 0) {
    riskScore += summary.bySeverity.CRITICAL * 25;
    factors.push(`${summary.bySeverity.CRITICAL} critical finding(s)`);
  }

  // Major findings
  if (summary.bySeverity.MAJOR > 0) {
    riskScore += summary.bySeverity.MAJOR * 10;
    factors.push(`${summary.bySeverity.MAJOR} major finding(s)`);
  }

  // Recurring issues multiplier
  if (summary.recurring > 0) {
    riskScore += summary.recurring * 15;
    factors.push(`${summary.recurring} recurring issue(s)`);
  }

  // Determine risk level
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (riskScore >= 75) riskLevel = 'CRITICAL';
  else if (riskScore >= 50) riskLevel = 'HIGH';
  else if (riskScore >= 25) riskLevel = 'MEDIUM';

  return { riskScore, riskLevel, factors };
}

/**
 * Export findings to structured format (for reporting)
 */
export function exportFindings(
  findings: AuditFinding[],
  format: 'CSV' | 'JSON',
): string {
  if (format === 'JSON') {
    return JSON.stringify(findings, null, 2);
  }

  // CSV format
  const headers = ['ID', 'Severity', 'Description', 'Location', 'Recurring', 'Evidence Count'];
  const rows = findings.map((f) => [
    f.id,
    f.severity,
    f.description.replace(/,/g, ';'), // Escape commas
    f.location || 'N/A',
    f.isRecurring ? 'Yes' : 'No',
    f.evidence?.length || 0,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

