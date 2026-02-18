import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface TimeSheet {
  id: string;
  orgId: string;
  employeeId: string;
  periodStart: Date;
  periodEnd: Date;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  totalRegularHours: number;
  totalOvertimeHours: number;
  totalPTOHours: number;
  submittedDate?: Date;
  approvedBy?: string;
}

export interface TimeEntry {
  id: string;
  timeSheetId: string;
  date: Date;
  clockIn?: Date;
  clockOut?: Date;
  breakMinutes: number;
  regularHours: number;
  overtimeHours: number;
  entryType: 'WORK' | 'PTO' | 'SICK' | 'HOLIDAY';
  projectId?: string;
  notes?: string;
}

export async function createTimeSheet(
  db: NeonHttpDatabase,
  employeeId: string,
  periodStart: Date,
  periodEnd: Date,
): Promise<TimeSheet> {
  // TODO: Insert timesheet with DRAFT status
  throw new Error('Database integration pending');
}

export async function clockIn(
  db: NeonHttpDatabase,
  timeSheetId: string,
  clockInTime: Date,
): Promise<TimeEntry> {
  // TODO: Create time entry with clock-in time
  throw new Error('Database integration pending');
}

export async function clockOut(
  db: NeonHttpDatabase,
  entryId: string,
  clockOutTime: Date,
  breakMinutes: number = 0,
): Promise<TimeEntry> {
  // TODO: Update time entry with clock-out and calculate hours
  throw new Error('Database integration pending');
}

export async function submitTimeSheet(
  db: NeonHttpDatabase,
  timeSheetId: string,
): Promise<TimeSheet> {
  // TODO: Calculate totals and update status to SUBMITTED
  throw new Error('Database integration pending');
}

export function calculateHoursWorked(
  clockIn: Date,
  clockOut: Date,
  breakMinutes: number = 0,
): { regularHours: number; overtimeHours: number } {
  const totalMinutes = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60) - breakMinutes;
  const totalHours = totalMinutes / 60;

  const regularHours = Math.min(totalHours, 8);
  const overtimeHours = Math.max(0, totalHours - 8);

  return { regularHours, overtimeHours };
}

export function validateTimeEntry(
  entry: TimeEntry,
  shiftStart: Date,
  shiftEnd: Date,
): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  if (!entry.clockIn || !entry.clockOut) {
    warnings.push('Missing clock-in or clock-out time');
    return { valid: false, warnings };
  }

  // Check if clocked in too early
  if (entry.clockIn < shiftStart) {
    const minutesEarly = Math.floor((shiftStart.getTime() - entry.clockIn.getTime()) / (1000 * 60));
    warnings.push(`Clocked in ${minutesEarly} minutes before shift start`);
  }

  // Check if clocked out too late
  if (entry.clockOut > shiftEnd) {
    const minutesLate = Math.floor((entry.clockOut.getTime() - shiftEnd.getTime()) / (1000 * 60));
    warnings.push(`Clocked out ${minutesLate} minutes after shift end`);
  }

  // Check for reasonable break time
  if (entry.breakMinutes > 120) {
    warnings.push(`Unusually long break: ${entry.breakMinutes} minutes`);
  }

  return { valid: warnings.length === 0, warnings };
}

export function aggregateWeeklyHours(
  entries: TimeEntry[],
): { totalRegular: number; totalOvertime: number; byDay: Map<string, number> } {
  let totalRegular = 0;
  let totalOvertime = 0;
  const byDay = new Map<string, number>();

  for (const entry of entries) {
    totalRegular += entry.regularHours;
    totalOvertime += entry.overtimeHours;

    const dayKey = entry.date.toISOString().split('T')[0];
    byDay.set(dayKey, (byDay.get(dayKey) || 0) + entry.regularHours + entry.overtimeHours);
  }

  return { totalRegular, totalOvertime, byDay };
}

export function detectAnomalies(
  entries: TimeEntry[],
): Array<{ entry: TimeEntry; anomalyType: string; description: string }> {
  const anomalies: Array<{ entry: TimeEntry; anomalyType: string; description: string }> = [];

  for (const entry of entries) {
    if (!entry.clockIn || !entry.clockOut) continue;

    const hoursWorked = entry.regularHours + entry.overtimeHours;

    // Excessive hours
    if (hoursWorked > 12) {
      anomalies.push({
        entry,
        anomalyType: 'EXCESSIVE_HOURS',
        description: `Worked ${hoursWorked.toFixed(1)} hours in one day`,
      });
    }

    // Missing break on long shift
    if (hoursWorked > 6 && entry.breakMinutes === 0) {
      anomalies.push({
        entry,
        anomalyType: 'MISSING_BREAK',
        description: 'No break taken on shift longer than 6 hours',
      });
    }

    // Weekend work
    const dayOfWeek = entry.date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      anomalies.push({
        entry,
        anomalyType: 'WEEKEND_WORK',
        description: 'Work performed on weekend',
      });
    }
  }

  return anomalies;
}
