import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface AccountingPeriod {
  id: string;
  orgId: string;
  fiscalYear: number;
  periodNumber: number;
  periodName: string;
  startDate: Date;
  endDate: Date;
  status: 'OPEN' | 'CLOSED' | 'LOCKED';
  closedBy?: string;
  closedAt?: Date;
}

export function createFiscalYear(
  _db: NeonHttpDatabase,
  _orgId: string,
  _fiscalYear: number,
  _startDate: Date,
  _periodCount: number = 12,
): AccountingPeriod[] {
  // TODO: Generate periods and insert into database
  throw new Error('Database integration pending');
}

export function getPeriods(
  _db: NeonHttpDatabase,
  _orgId: string,
  _fiscalYear?: number,
): AccountingPeriod[] {
  // TODO: Query database
  throw new Error('Database integration pending');
}

export function closePeriod(
  _db: NeonHttpDatabase,
  _periodId: string,
  _userId: string,
): AccountingPeriod {
  // TODO: Update period status to CLOSED
  throw new Error('Database integration pending');
}

export function reopenPeriod(
  _db: NeonHttpDatabase,
  _periodId: string,
  _userId: string,
): AccountingPeriod {
  // TODO: Update period status to OPEN (if next period not closed)
  throw new Error('Database integration pending');
}

export function generatePeriods(
  fiscalYear: number,
  startDate: Date,
  periodCount: number,
): Omit<AccountingPeriod, 'id' | 'orgId' | 'status'>[] {
  const periods: Omit<AccountingPeriod, 'id' | 'orgId' | 'status'>[] = [];
  const start = new Date(startDate);

  for (let i = 0; i < periodCount; i++) {
    const periodStart = new Date(start);
    periodStart.setMonth(start.getMonth() + i);

    const periodEnd = new Date(periodStart);
    periodEnd.setMonth(periodEnd.getMonth() + 1);
    periodEnd.setDate(0); // Last day of month

    periods.push({
      fiscalYear,
      periodNumber: i + 1,
      periodName: `Period ${i + 1}`,
      startDate: periodStart,
      endDate: periodEnd,
    });
  }

  return periods;
}

export function validatePeriodClose(period: AccountingPeriod, nextPeriod?: AccountingPeriod): {
  canClose: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (period.status === 'CLOSED') {
    issues.push('Period is already closed');
  }

  if (nextPeriod?.status === 'CLOSED') {
    issues.push('Cannot close period when future period is already closed');
  }

  // Add more validation rules as needed

  return {
    canClose: issues.length === 0,
    issues,
  };
}
