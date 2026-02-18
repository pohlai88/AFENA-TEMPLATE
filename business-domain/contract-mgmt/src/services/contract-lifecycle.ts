import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface Contract {
  id: string;
  orgId: string;
  contractNumber: string;
  contractName: string;
  counterparty: string;
  contractType: 'CUSTOMER' | 'VENDOR' | 'EMPLOYMENT' | 'NDA' | 'PARTNERSHIP' | 'SERVICE';
  startDate: Date;
  endDate: Date;
  autoRenewal: boolean;
  renewalNoticeDays?: number;
  contractValue: number;
  currency: string;
  status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
  ownerId: string;
}

export interface ContractMilestone {
  id: string;
  contractId: string;
  description: string;
  dueDate: Date;
  status: 'PENDING' | 'COMPLETED' | 'MISSED';
  completedDate?: Date;
}

export async function createContract(
  db: NeonHttpDatabase,
  data: Omit<Contract, 'id' | 'contractNumber' | 'status'>,
): Promise<Contract> {
  // TODO: Generate contract number and insert with DRAFT status
  throw new Error('Database integration pending');
}

export async function updateContractStatus(
  db: NeonHttpDatabase,
  contractId: string,
  status: Contract['status'],
): Promise<Contract> {
  // TODO: Update contract status
  throw new Error('Database integration pending');
}

export async function getExpiringContracts(
  db: NeonHttpDatabase,
  orgId: string,
  daysAhead: number = 90,
): Promise<Contract[]> {
  // TODO: Query contracts expiring within specified days
  throw new Error('Database integration pending');
}

export async function addMilestone(
  db: NeonHttpDatabase,
  data: Omit<ContractMilestone, 'id' | 'status'>,
): Promise<ContractMilestone> {
  // TODO: Insert milestone with PENDING status
  throw new Error('Database integration pending');
}

export function generateContractNumber(
  orgId: string,
  contractType: string,
  sequence: number,
): string {
  const year = new Date().getFullYear();
  const typeCode = contractType.substring(0, 3).toUpperCase();
  return `CTR-${orgId}-${typeCode}-${year}-${String(sequence).padStart(5, '0')}`;
}

export function calculateRenewalDate(
  endDate: Date,
  renewalNoticeDays: number,
): Date {
  const renewalDate = new Date(endDate);
  renewalDate.setDate(renewalDate.getDate() - renewalNoticeDays);
  return renewalDate;
}

export function identifyRenewalOpportunities(
  contracts: Contract[],
  daysAhead: number = 90,
): Array<{
    contract: Contract;
    daysUntilExpiry: number;
    renewalActionDate: Date;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }> {
  const today = new Date();
  
  return contracts
    .filter((c) => c.status === 'ACTIVE')
    .map((contract) => {
      const daysUntilExpiry = Math.floor(
        (contract.endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );

      const renewalActionDate = contract.renewalNoticeDays
        ? calculateRenewalDate(contract.endDate, contract.renewalNoticeDays)
        : new Date(contract.endDate);

      let priority: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
      if (contract.contractValue > 100000 && daysUntilExpiry <= daysAhead) {
        priority = 'HIGH';
      } else if (daysUntilExpiry <= daysAhead / 2) {
        priority = 'MEDIUM';
      }

      return { contract, daysUntilExpiry, renewalActionDate, priority };
    })
    .filter((item) => item.daysUntilExpiry <= daysAhead)
    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
}

export function assessComplianceRisk(
  contract: Contract,
  milestones: ContractMilestone[],
): { riskLevel: 'HIGH' | 'MEDIUM' | 'LOW'; missedMilestones: number; upcomingMilestones: number } {
  const missedMilestones = milestones.filter((m) => m.status === 'MISSED').length;
  
  const today = new Date();
  const upcomingMilestones = milestones.filter(
    (m) => m.status === 'PENDING' && m.dueDate.getTime() - today.getTime() <= 30 * 24 * 60 * 60 * 1000,
  ).length;

  let riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
  if (missedMilestones > 2) riskLevel = 'HIGH';
  else if (missedMilestones > 0 || upcomingMilestones > 3) riskLevel = 'MEDIUM';

  return { riskLevel, missedMilestones, upcomingMilestones };
}

export function calculateContractUtilization(
  contractValue: number,
  amountInvoiced: number,
  amountPaid: number,
): { utilizationRate: number; remainingValue: number; paymentRate: number } {
  const utilizationRate = contractValue > 0 ? (amountInvoiced / contractValue) * 100 : 0;
  const remainingValue = contractValue - amountInvoiced;
  const paymentRate = amountInvoiced > 0 ? (amountPaid / amountInvoiced) * 100 : 0;

  return { utilizationRate, remainingValue, paymentRate };
}
