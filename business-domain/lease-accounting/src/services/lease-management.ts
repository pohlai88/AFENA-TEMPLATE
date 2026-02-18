import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface Lease {
  id: string;
  orgId: string;
  leaseNumber: string;
  classification: 'OPERATING' | 'FINANCE';
  standard: 'ASC_842' | 'IFRS_16';
  lessorName: string;
  leasedAssetDescription: string;
  commencementDate: Date;
  expiryDate: Date;
  leaseTerm: number; // months
  monthlyPayment: number;
  currency: string;
  discountRate: number; // percentage
  status: 'ACTIVE' | 'TERMINATED' | 'EXPIRED';
}

export interface LeaseSchedule {
  leaseId: string;
  period: string; // YYYY-MM
  paymentAmount: number;
  interestExpense: number;
  principalReduction: number;
  remainingLiability: number;
  rouAssetBalance: number;
}

export async function createLease(
  db: NeonHttpDatabase,
  data: Omit<Lease, 'id' | 'status'>,
): Promise<Lease> {
  // TODO: Insert lease with ACTIVE status
  throw new Error('Database integration pending');
}

export async function generateLeaseSchedule(
  db: NeonHttpDatabase,
  leaseId: string,
): Promise<LeaseSchedule[]> {
  // TODO: Generate lease payment schedule
  throw new Error('Database integration pending');
}

export async function terminateLease(
  db: NeonHttpDatabase,
  leaseId: string,
  terminationDate: Date,
): Promise<Lease> {
  // TODO: Update lease status to TERMINATED
  throw new Error('Database integration pending');
}

export function calculateInitialMeasurement(
  monthlyPayment: number,
  leaseTerm: number,
  discountRate: number, // annual percentage
): { leaseLiability: number; rouAsset: number } {
  const monthlyRate = discountRate / 100 / 12;
  
  // Present value of lease payments
  let pv = 0;
  for (let i = 1; i <= leaseTerm; i++) {
    pv += monthlyPayment / Math.pow(1 + monthlyRate, i);
  }

  return {
    leaseLiability: Math.round(pv * 100) / 100,
    rouAsset: Math.round(pv * 100) / 100, // Initially equal, adjusted for initial direct costs
  };
}

export function buildLeaseAmortizationSchedule(
  initialLiability: number,
  monthlyPayment: number,
  discountRate: number, // annual percentage
  leaseTerm: number,
  commencementDate: Date,
): LeaseSchedule[] {
  const schedule: LeaseSchedule[] = [];
  const monthlyRate = discountRate / 100 / 12;
  
  let liability = initialLiability;
  const rouDepreciation = initialLiability / leaseTerm;
  let rouBalance = initialLiability;

  for (let i = 0; i < leaseTerm; i++) {
    const interest = liability * monthlyRate;
    const principal = monthlyPayment - interest;
    
    liability -= principal;
    rouBalance -= rouDepreciation;

    const periodDate = new Date(commencementDate);
    periodDate.setMonth(periodDate.getMonth() + i);

    schedule.push({
      leaseId: '', // Will be set by caller
      period: `${periodDate.getFullYear()}-${String(periodDate.getMonth() + 1).padStart(2, '0')}`,
      paymentAmount: monthlyPayment,
      interestExpense: Math.round(interest * 100) / 100,
      principalReduction: Math.round(principal * 100) / 100,
      remainingLiability: Math.max(0, Math.round(liability * 100) / 100),
      rouAssetBalance: Math.max(0, Math.round(rouBalance * 100) / 100),
    });
  }

  return schedule;
}

export function classifyLease(
  leaseTerm: number,
  assetUsefulLife: number,
  presentValueOfPayments: number,
  assetFairValue: number,
  transfersOwnership: boolean = false,
  purchaseOptionLikelyToExercise: boolean = false,
): 'OPERATING' | 'FINANCE' {
  // ASC 842 / IFRS 16 classification criteria
  
  if (transfersOwnership || purchaseOptionLikelyToExercise) {
    return 'FINANCE';
  }

  const termPercentage = (leaseTerm / assetUsefulLife) * 100;
  const pvPercentage = (presentValueOfPayments / assetFairValue) * 100;

  // Major part of economic life (>75%) or substantially all fair value (>90%)
  if (termPercentage >= 75 || pvPercentage >= 90) {
    return 'FINANCE';
  }

  return 'OPERATING';
}

export function calculateLeaseModificationImpact(
  originalLiability: number,
  originalPayment: number,
  newPayment: number,
  remainingTerm: number,
  discountRate: number,
): { newLiability: number; adjustmentAmount: number } {
  const { leaseLiability: newLiability } = calculateInitialMeasurement(
    newPayment,
    remainingTerm,
    discountRate,
  );

  const adjustmentAmount = newLiability - originalLiability;

  return { newLiability, adjustmentAmount };
}
