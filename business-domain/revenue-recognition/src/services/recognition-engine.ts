import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface RevenueContract {
  id: string;
  orgId: string;
  contractNumber: string;
  customerId: string;
  contractDate: Date;
  totalContractValue: number;
  currency: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  recognitionMethod: 'POINT_IN_TIME' | 'OVER_TIME';
  performanceObligations: Array<{
    id: string;
    description: string;
    allocatedValue: number;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SATISFIED';
  }>;
}

export interface RevenueSchedule {
  id: string;
  contractId: string;
  performanceObligationId: string;
  period: string; // YYYY-MM
  recognizedAmount: number;
  remainingDeferred: number;
}

export async function createRevenueContract(
  db: NeonHttpDatabase,
  data: Omit<RevenueContract, 'id' | 'status'>,
): Promise<RevenueContract> {
  // TODO: Insert revenue contract with ACTIVE status
  throw new Error('Database integration pending');
}

export async function generateRevenueSchedule(
  db: NeonHttpDatabase,
  contractId: string,
  startDate: Date,
  endDate: Date,
): Promise<RevenueSchedule[]> {
  // TODO: Generate revenue recognition schedule
  throw new Error('Database integration pending');
}

export async function recognizeRevenue(
  db: NeonHttpDatabase,
  contractId: string,
  period: string,
  amount: number,
): Promise<RevenueSchedule> {
  // TODO: Record revenue recognition
  throw new Error('Database integration pending');
}

export function allocateTransactionPrice(
  totalPrice: number,
  performanceObligations: Array<{
    id: string;
    standaloneSellingPrice: number;
  }>,
): Array<{ id: string; allocatedValue: number }> {
  const totalSSP = performanceObligations.reduce((sum, po) => sum + po.standaloneSellingPrice, 0);

  return performanceObligations.map((po) => ({
    id: po.id,
    allocatedValue: totalSSP > 0 ? (po.standaloneSellingPrice / totalSSP) * totalPrice : 0,
  }));
}

export function calculateStraightLineRecognition(
  totalAmount: number,
  startDate: Date,
  endDate: Date,
): Array<{ period: string; amount: number }> {
  const schedule: Array<{ period: string; amount: number }> = [];
  
  const months = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30),
  );
  const monthlyAmount = totalAmount / months;

  for (let i = 0; i < months; i++) {
    const periodDate = new Date(startDate);
    periodDate.setMonth(periodDate.getMonth() + i);

    schedule.push({
      period: `${periodDate.getFullYear()}-${String(periodDate.getMonth() + 1).padStart(2, '0')}`,
      amount: monthlyAmount,
    });
  }

  return schedule;
}

export function calculatePercentageOfCompletion(
  costIncurred: number,
  totalEstimatedCost: number,
): number {
  return totalEstimatedCost > 0 ? (costIncurred / totalEstimatedCost) * 100 : 0;
}

export function calculateRevenueToRecognize(
  totalContractValue: number,
  percentComplete: number,
  previouslyRecognized: number,
): number {
  const totalToRecognize = totalContractValue * (percentComplete / 100);
  return Math.max(0, totalToRecognize - previouslyRecognized);
}

export function identifyRevenueLeak(
  contracts: RevenueContract[],
  schedules: Map<string, RevenueSchedule[]>,
): Array<{
  contractId: string;
  billedAmount: number;
  recognizedAmount: number;
  deferredAmount: number;
  leakAmount: number;
}> {
  return contracts.map((contract) => {
    const contractSchedules = schedules.get(contract.id) || [];
    const recognizedAmount = contractSchedules.reduce((sum, s) => sum + s.recognizedAmount, 0);
    const deferredAmount = contract.totalContractValue - recognizedAmount;

    return {
      contractId: contract.id,
      billedAmount: contract.totalContractValue,
      recognizedAmount,
      deferredAmount,
      leakAmount: 0, // TODO: Calculate actual leak based on contract terms
    };
  });
}
