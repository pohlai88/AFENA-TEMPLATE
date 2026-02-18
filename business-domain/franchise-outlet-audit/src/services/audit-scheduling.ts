import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { AuditSchedule, AuditType } from '../types/common.js';

/**
 * Create an audit schedule
 */
export async function createSchedule(
  db: NeonHttpDatabase,
  data: Omit<AuditSchedule, 'id' | 'createdAt'>,
): Promise<AuditSchedule> {
  // TODO: Insert into database
  // INSERT INTO audit_schedules (outlet_id, audit_type, frequency_days, next_audit_date, ...)
  throw new Error('Database integration pending');
}

/**
 * Get audit schedules for an outlet
 */
export async function getOutletSchedules(
  db: NeonHttpDatabase,
  outletId: string,
): Promise<AuditSchedule[]> {
  // TODO: Query database
  throw new Error('Database integration pending');
}

/**
 * Get upcoming audits across all outlets
 */
export async function getUpcomingAudits(
  db: NeonHttpDatabase,
  daysAhead: number = 30,
): Promise<AuditSchedule[]> {
  // TODO: Query schedules where next_audit_date <= NOW() + $daysAhead days
  throw new Error('Database integration pending');
}

/**
 * Update schedule after audit completion
 */
export async function updateScheduleAfterAudit(
  db: NeonHttpDatabase,
  scheduleId: string,
  auditId: string,
): Promise<AuditSchedule> {
  // TODO: Update last_audit_date, calculate next_audit_date based on frequency
  // UPDATE audit_schedules SET last_audit_date = NOW(), next_audit_date = NOW() + INTERVAL '...'
  throw new Error('Database integration pending');
}

/**
 * Adjust audit frequency based on performance
 */
export async function adjustFrequency(
  db: NeonHttpDatabase,
  scheduleId: string,
  newFrequencyDays: number,
  reason: string,
): Promise<AuditSchedule> {
  // TODO: Update frequency_days and recalculate next_audit_date
  throw new Error('Database integration pending');
}

/**
 * Determine optimal audit frequency based on risk
 */
export function determineAuditFrequency(
  auditType: AuditType,
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
  recentScore?: number,
): {
  frequencyDays: number;
  rationale: string;
} {
  // Base frequency by audit type
  const baseFrequency: Record<AuditType, number> = {
    QUALITY: 90, // Quarterly
    HEALTH_SAFETY: 30, // Monthly (critical)
    BRAND_STANDARDS: 180, // Semi-annual
    OPERATIONAL: 90, // Quarterly
    FINANCIAL: 90, // Quarterly
    MYSTERY_SHOPPER: 60, // Bi-monthly
  };

  let frequencyDays = baseFrequency[auditType];
  let rationale = `Base ${auditType} frequency`;

  // Adjust for risk level
  if (riskLevel === 'CRITICAL') {
    frequencyDays = Math.floor(frequencyDays * 0.5); // 2x more frequent
    rationale += ', increased due to CRITICAL risk level';
  } else if (riskLevel === 'HIGH') {
    frequencyDays = Math.floor(frequencyDays * 0.75);
    rationale += ', increased due to HIGH risk level';
  } else if (riskLevel === 'LOW' && recentScore && recentScore >= 95) {
    frequencyDays = Math.floor(frequencyDays * 1.5); // Less frequent for excellent performers
    rationale += ', reduced due to excellent performance';
  }

  // Minimum frequency safeguards
  if (auditType === 'HEALTH_SAFETY' && frequencyDays > 30) {
    frequencyDays = 30;
    rationale += ' (capped at monthly for safety)';
  }

  return { frequencyDays, rationale };
}

/**
 * Generate audit calendar for a period
 */
export function generateAuditCalendar(
  schedules: AuditSchedule[],
  startDate: Date,
  endDate: Date,
): Array<{
  date: Date;
  outletId: string;
  auditType: AuditType;
  scheduleId: string;
}> {
  const calendar: Array<{
    date: Date;
    outletId: string;
    auditType: AuditType;
    scheduleId: string;
  }> = [];

  for (const schedule of schedules) {
    let currentDate = new Date(schedule.nextAuditDate);

    // Generate recurring dates within the period
    while (currentDate <= endDate) {
      if (currentDate >= startDate) {
        calendar.push({
          date: new Date(currentDate),
          outletId: schedule.outletId,
          auditType: schedule.auditType,
          scheduleId: schedule.id,
        });
      }

      // Move to next occurrence
      currentDate = new Date(
        currentDate.getTime() + schedule.frequencyDays * 24 * 60 * 60 * 1000,
      );
    }
  }

  return calendar.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Identify scheduling conflicts (multiple audits same day/week)
 */
export function identifySchedulingConflicts(
  calendar: Array<{
    date: Date;
    outletId: string;
    auditType: AuditType;
  }>,
): Array<{
  date: Date;
  conflicts: Array<{ outletId: string; auditType: AuditType }>;
  severity: 'SAME_DAY' | 'SAME_WEEK';
}> {
  const conflicts: Array<{
    date: Date;
    conflicts: Array<{ outletId: string; auditType: AuditType }>;
    severity: 'SAME_DAY' | 'SAME_WEEK';
  }> = [];

  // Group by date
  const byDate = new Map<string, typeof calendar>();
  for (const entry of calendar) {
    const dateKey = entry.date.toISOString().split('T')[0];
    if (!byDate.has(dateKey)) {
      byDate.set(dateKey, []);
    }
    byDate.get(dateKey)!.push(entry);
  }

  // Check for same-day conflicts
  for (const [dateKey, entries] of byDate.entries()) {
    if (entries.length > 1) {
      conflicts.push({
        date: new Date(dateKey),
        conflicts: entries.map((e) => ({
          outletId: e.outletId,
          auditType: e.auditType,
        })),
        severity: 'SAME_DAY',
      });
    }
  }

  return conflicts;
}

/**
 * Optimize audit schedule to balance auditor workload
 */
export function optimizeSchedule(
  schedules: AuditSchedule[],
  maxAuditsPerWeek: number = 5,
): Array<{
  scheduleId: string;
  originalDate: Date;
  suggestedDate: Date;
  reason: string;
}> {
  const adjustments: Array<{
    scheduleId: string;
    originalDate: Date;
    suggestedDate: Date;
    reason: string;
  }> = [];

  // Generate calendar for next 3 months
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 3);

  const calendar = generateAuditCalendar(schedules, startDate, endDate);

  // Count audits per week
  const weekCounts = new Map<string, number>();
  for (const entry of calendar) {
    const weekKey = getWeekKey(entry.date);
    weekCounts.set(weekKey, (weekCounts.get(weekKey) || 0) + 1);
  }

  // Identify overloaded weeks and suggest adjustments
  for (const [weekKey, count] of weekCounts.entries()) {
    if (count > maxAuditsPerWeek) {
      const weekEntries = calendar.filter(
        (e) => getWeekKey(e.date) === weekKey,
      );

      // Move lower priority audits to next week
      const toMove = weekEntries.slice(maxAuditsPerWeek);
      for (const entry of toMove) {
        const suggestedDate = new Date(entry.date);
        suggestedDate.setDate(suggestedDate.getDate() + 7);

        adjustments.push({
          scheduleId: entry.scheduleId,
          originalDate: entry.date,
          suggestedDate,
          reason: `Week of ${weekKey} overloaded (${count} audits)`,
        });
      }
    }
  }

  return adjustments;
}

/**
 * Get week key for grouping (YYYY-WW format)
 */
function getWeekKey(date: Date): string {
  const year = date.getFullYear();
  const firstDayOfYear = new Date(year, 0, 1);
  const daysSinceStart = Math.floor(
    (date.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24),
  );
  const weekNumber = Math.ceil((daysSinceStart + firstDayOfYear.getDay() + 1) / 7);
  return `${year}-${weekNumber.toString().padStart(2, '0')}`;
}

/**
 * Check for overdue audits
 */
export function identifyOverdueAudits(
  schedules: AuditSchedule[],
): Array<{
  schedule: AuditSchedule;
  daysOverdue: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}> {
  const now = Date.now();

  return schedules
    .filter((s) => new Date(s.nextAuditDate).getTime() < now)
    .map((schedule) => {
      const daysOverdue = Math.floor(
        (now - new Date(schedule.nextAuditDate).getTime()) / (1000 * 60 * 60 * 24),
      );

      let priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' = 'MEDIUM';
      if (
        schedule.auditType === 'HEALTH_SAFETY' ||
        daysOverdue > 30
      ) {
        priority = 'CRITICAL';
      } else if (daysOverdue > 14) {
        priority = 'HIGH';
      }

      return { schedule, daysOverdue, priority };
    })
    .sort((a, b) => b.daysOverdue - a.daysOverdue);
}

/**
 * Generate schedule compliance report
 */
export function generateScheduleComplianceReport(
  schedules: AuditSchedule[],
): {
  totalSchedules: number;
  compliant: number;
  overdue: number;
  complianceRate: number;
  byAuditType: Record<AuditType, { total: number; compliant: number }>;
} {
  const report = {
    totalSchedules: schedules.length,
    compliant: 0,
    overdue: 0,
    complianceRate: 0,
    byAuditType: {} as Record<AuditType, { total: number; compliant: number }>,
  };

  const now = Date.now();

  for (const schedule of schedules) {
    // Initialize audit type stats
    if (!report.byAuditType[schedule.auditType]) {
      report.byAuditType[schedule.auditType] = { total: 0, compliant: 0 };
    }
    report.byAuditType[schedule.auditType].total++;

    // Check compliance
    const isCompliant = new Date(schedule.nextAuditDate).getTime() >= now;
    if (isCompliant) {
      report.compliant++;
      report.byAuditType[schedule.auditType].compliant++;
    } else {
      report.overdue++;
    }
  }

  report.complianceRate =
    report.totalSchedules > 0
      ? (report.compliant / report.totalSchedules) * 100
      : 0;

  return report;
}

