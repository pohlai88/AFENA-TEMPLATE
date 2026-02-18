import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface TimeEntry {
  id: string;
  employeeId: string;
  date: Date;
  regularHours: number;
  overtimeHours: number;
  ptoHours: number;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
}

export interface PTOBalance {
  employeeId: string;
  ptoType: 'VACATION' | 'SICK' | 'PERSONAL';
  accrued: number;
  used: number;
  balance: number;
}

export async function recordTimeEntry(
  db: NeonHttpDatabase,
  data: Omit<TimeEntry, 'id' | 'status'>,
): Promise<TimeEntry> {
  // TODO: Insert time entry with DRAFT status
  throw new Error('Database integration pending');
}

export async function submitTimesheet(
  db: NeonHttpDatabase,
  employeeId: string,
  periodStart: Date,
  periodEnd: Date,
): Promise<TimeEntry[]> {
  // TODO: Update all time entries for period to SUBMITTED
  throw new Error('Database integration pending');
}

export async function getPTOBalance(
  db: NeonHttpDatabase,
  employeeId: string,
): Promise<PTOBalance[]> {
  // TODO: Query PTO balances
  throw new Error('Database integration pending');
}

export function calculateOvertimeHours(
  dailyHours: Array<{ date: Date; hours: number }>,
  overtimeRule: 'DAILY' | 'WEEKLY' | 'BOTH',
  dailyThreshold: number = 8,
  weeklyThreshold: number = 40,
): { regularHours: number; overtimeHours: number } {
  let totalRegular = 0;
  let totalOvertime = 0;

  if (overtimeRule === 'DAILY' || overtimeRule === 'BOTH') {
    for (const entry of dailyHours) {
      if (entry.hours > dailyThreshold) {
        totalRegular += dailyThreshold;
        totalOvertime += entry.hours - dailyThreshold;
      } else {
        totalRegular += entry.hours;
      }
    }
  } else {
    totalRegular = dailyHours.reduce((sum, entry) => sum + entry.hours, 0);
  }

  if (overtimeRule === 'WEEKLY' || overtimeRule === 'BOTH') {
    if (totalRegular > weeklyThreshold) {
      const weeklyOT = totalRegular - weeklyThreshold;
      totalOvertime += weeklyOT;
      totalRegular = weeklyThreshold;
    }
  }

  return { regularHours: totalRegular, overtimeHours: totalOvertime };
}

export function calculatePTOAccrual(
  hireDate: Date,
  asOfDate: Date,
  accrualRate: number, // hours per pay period
  payPeriodsPerYear: number = 26,
): number {
  const yearsOfService = (asOfDate.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
  
  // Increase accrual rate based on tenure
  let adjustedRate = accrualRate;
  if (yearsOfService >= 10) adjustedRate *= 1.5;
  else if (yearsOfService >= 5) adjustedRate *= 1.25;

  const payPeriodsPassed = Math.floor(
    (asOfDate.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * (365 / payPeriodsPerYear)),
  );

  return payPeriodsPassed * adjustedRate;
}
