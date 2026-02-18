import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface TaxFiling {
  id: string;
  orgId: string;
  jurisdiction: string; // Federal, State, Local
  taxType: 'INCOME' | 'SALES' | 'PAYROLL' | 'PROPERTY' | 'VAT';
  filingPeriod: string; // YYYY-MM or YYYY-Q1
  dueDate: Date;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'READY' | 'FILED' | 'ACCEPTED' | 'REJECTED';
  filedDate?: Date;
  taxLiability: number;
  paymentAmount?: number;
}

export interface TaxObligationCalendar {
  jurisdiction: string;
  taxType: string;
  frequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  dueDay: number; // Day of month
  dueDaysAfterPeriod: number;
}

export async function createTaxFiling(
  db: NeonHttpDatabase,
  data: Omit<TaxFiling, 'id' | 'status'>,
): Promise<TaxFiling> {
  // TODO: Insert tax filing with NOT_STARTED status
  throw new Error('Database integration pending');
}

export async function updateFilingStatus(
  db: NeonHttpDatabase,
  filingId: string,
  status: TaxFiling['status'],
  filedDate?: Date,
): Promise<TaxFiling> {
  // TODO: Update filing status
  throw new Error('Database integration pending');
}

export async function getUpcomingFilings(
  db: NeonHttpDatabase,
  orgId: string,
  daysAhead: number = 30,
): Promise<TaxFiling[]> {
  // TODO: Query filings due within specified days
  throw new Error('Database integration pending');
}

export function generateTaxCalendar(
  obligations: TaxObligationCalendar[],
  year: number,
): Array<{ obligation: TaxObligationCalendar; dueDate: Date; period: string }> {
  const calendar: Array<{ obligation: TaxObligationCalendar; dueDate: Date; period: string }> = [];

  for (const obligation of obligations) {
    if (obligation.frequency === 'MONTHLY') {
      for (let month = 1; month <= 12; month++) {
        const dueDate = new Date(year, month, obligation.dueDay);
        calendar.push({
          obligation,
          dueDate,
          period: `${year}-${String(month).padStart(2, '0')}`,
        });
      }
    } else if (obligation.frequency === 'QUARTERLY') {
      for (let quarter = 1; quarter <= 4; quarter++) {
        const month = quarter * 3;
        const dueDate = new Date(year, month, obligation.dueDay);
        calendar.push({
          obligation,
          dueDate,
          period: `${year}-Q${quarter}`,
        });
      }
    } else if (obligation.frequency === 'ANNUAL') {
      const dueDate = new Date(year + 1, 3, obligation.dueDay); // April 15 for most annual filings
      calendar.push({
        obligation,
        dueDate,
        period: `${year}`,
      });
    }
  }

  return calendar.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}

export function calculatePenaltyAndInterest(
  taxOwed: number,
  dueDate: Date,
  paymentDate: Date,
  penaltyRate: number = 0.05, // 5% penalty
  interestRate: number = 0.03, // 3% annual interest
): { penalty: number; interest: number; total: number } {
  if (paymentDate <= dueDate) {
    return { penalty: 0, interest: 0, total: taxOwed };
  }

  const penalty = taxOwed * penaltyRate;
  
  const daysLate = Math.floor((paymentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
  const interest = taxOwed * (interestRate / 365) * daysLate;

  return {
    penalty,
    interest,
    total: taxOwed + penalty + interest,
  };
}

export function identifyFilingRisks(
  filings: TaxFiling[],
  daysThreshold: number = 7,
): Array<{ filing: TaxFiling; daysUntilDue: number; risk: 'CRITICAL' | 'HIGH' | 'MEDIUM' }> {
  const today = new Date();
  
  return filings
    .filter((f) => f.status !== 'FILED' && f.status !== 'ACCEPTED')
    .map((filing) => {
      const daysUntilDue = Math.floor((filing.dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      let risk: 'CRITICAL' | 'HIGH' | 'MEDIUM' = 'MEDIUM';
      if (daysUntilDue < 0) risk = 'CRITICAL'; // Overdue
      else if (daysUntilDue <= daysThreshold) risk = 'HIGH';

      return { filing, daysUntilDue, risk };
    })
    .filter((item) => item.risk === 'CRITICAL' || item.risk === 'HIGH')
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue);
}
