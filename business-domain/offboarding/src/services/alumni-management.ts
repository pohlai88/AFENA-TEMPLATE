import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { OffboardingPlan } from './plan-management.js';
import type { ExitInterview, analyzeExitTrends } from './exit-interview.js';

export interface AlumniRecord {
  alumniId: string;
  
  employeeId: string;
  name: string;
  lastJobTitle: string;
  department: string;
  
  hireDate: Date;
  exitDate: Date;
  tenure: number;
  
  personalEmail?: string;
  phone?: string;
  linkedinUrl?: string;
  
  currentCompany?: string;
  currentRole?: string;
  
  eligibleForRehire: boolean;
  willingToReturn: boolean;
  alumniProgramEnrolled: boolean;
  
  lastContactDate?: Date;
  referralsMade: number;
  
  status: 'ACTIVE' | 'NO_CONTACT' | 'REMOVED';
}

export interface FinalPayment {
  outstandingSalary: number;
  unusedVacationDays: number;
  vacationPayout: number;
  
  proRatedBonus?: number;
  outstandingCommissions?: number;
  
  advanceDeductions?: number;
  equipmentNotReturned?: number;
  
  benefitsContinuationInfo?: string;
  
  totalPayout: number;
  currency: string;
  
  paymentDate: Date;
  paymentMethod: 'DIRECT_DEPOSIT' | 'CHECK';
  paymentStatus: 'PENDING' | 'PROCESSED' | 'PAID';
}

export interface OffboardingMetrics {
  period: { start: Date; end: Date };
  
  totalExits: number;
  voluntaryExits: number;
  involuntaryExits: number;
  
  exitsByType: Record<string, number>;
  exitsByDepartment: Record<string, number>;
  exitsByTenure: Record<string, number>;
  
  avgOffboardingDuration: number;
  onTimeClearanceRate: number;
  knowledgeTransferCompletionRate: number;
  
  exitInterviewsCompleted: number;
  exitInterviewCompletionRate: number;
  
  avgJobSatisfaction: number;
  avgManagementSatisfaction: number;
  
  topExitReasons: Array<{ reason: string; count: number }>;
  rehireEligibilityRate: number;
  
  turnoverRate: number;
  voluntaryTurnoverRate: number;
}

export async function addToAlumniNetwork(
  _db: NeonHttpDatabase,
  _orgId: string,
  _alumni: Omit<AlumniRecord, 'alumniId' | 'referralsMade'>
): Promise<AlumniRecord> {
  throw new Error('Not implemented');
}

export function calculateTenure(hireDate: Date, exitDate: Date): number {
  const diffTime = exitDate.getTime() - hireDate.getTime();
  const years = diffTime / (1000 * 60 * 60 * 24 * 365.25);
  return Math.round(years * 10) / 10;
}

export function calculateVacationPayout(
  unusedDays: number,
  dailyRate: number
): number {
  return Math.round(unusedDays * dailyRate * 100) / 100;
}

export function calculateFinalPayment(
  salary: number,
  unusedVacationDays: number,
  bonus: number,
  deductions: number
): FinalPayment {
  const dailyRate = salary / 30;
  const vacationPayout = calculateVacationPayout(unusedVacationDays, dailyRate);
  const totalPayout = salary + vacationPayout + bonus - deductions;
  
  return {
    outstandingSalary: Math.round(salary * 100) / 100,
    unusedVacationDays,
    vacationPayout: Math.round(vacationPayout * 100) / 100,
    proRatedBonus: Math.round(bonus * 100) / 100,
    outstandingCommissions: 0,
    advanceDeductions: Math.round(deductions * 100) / 100,
    totalPayout: Math.round(totalPayout * 100) / 100,
    currency: 'USD',
    paymentDate: new Date(),
    paymentMethod: 'DIRECT_DEPOSIT',
    paymentStatus: 'PENDING',
  };
}

export function analyzeOffboardingMetrics(
  plans: OffboardingPlan[],
  interviews: ExitInterview[],
  totalEmployees: number,
  exitTrendsAnalyzer: typeof analyzeExitTrends
): OffboardingMetrics {
  const totalExits = plans.length;
  const voluntaryExits = plans.filter(p => 
    ['RESIGNATION', 'RETIREMENT'].includes(p.exitType)
  ).length;
  const involuntaryExits = plans.filter(p => 
    ['TERMINATION', 'LAYOFF', 'END_OF_CONTRACT'].includes(p.exitType)
  ).length;
  
  const exitsByType: Record<string, number> = {};
  plans.forEach(plan => {
    exitsByType[plan.exitType] = (exitsByType[plan.exitType] || 0) + 1;
  });
  
  const exitInterviewsCompleted = interviews.filter(i => i.completed).length;
  const exitInterviewCompletionRate = totalExits > 0 
    ? (exitInterviewsCompleted / totalExits) * 100 
    : 0;
  
  const jobSatisfactions = interviews
    .map(i => i.jobSatisfaction)
    .filter((s): s is number => s !== undefined);
  const avgJobSatisfaction = jobSatisfactions.length > 0
    ? jobSatisfactions.reduce((sum, s) => sum + s, 0) / jobSatisfactions.length
    : 0;
  
  const managementSatisfactions = interviews
    .map(i => i.managementSatisfaction)
    .filter((s): s is number => s !== undefined);
  const avgManagementSatisfaction = managementSatisfactions.length > 0
    ? managementSatisfactions.reduce((sum, s) => sum + s, 0) / managementSatisfactions.length
    : 0;
  
  const exitTrends = exitTrendsAnalyzer(interviews);
  
  const rehireEligible = interviews.filter(i => i.wouldRehire).length;
  const rehireEligibilityRate = interviews.length > 0 
    ? (rehireEligible / interviews.length) * 100 
    : 0;
  
  const turnoverRate = totalEmployees > 0 ? (totalExits / totalEmployees) * 100 : 0;
  const voluntaryTurnoverRate = totalEmployees > 0 ? (voluntaryExits / totalEmployees) * 100 : 0;
  
  return {
    period: { start: new Date(), end: new Date() },
    
    totalExits,
    voluntaryExits,
    involuntaryExits,
    
    exitsByType,
    exitsByDepartment: {},
    exitsByTenure: {},
    
    avgOffboardingDuration: 0,
    onTimeClearanceRate: 0,
    knowledgeTransferCompletionRate: 0,
    
    exitInterviewsCompleted,
    exitInterviewCompletionRate: Math.round(exitInterviewCompletionRate),
    
    avgJobSatisfaction: Math.round(avgJobSatisfaction * 10) / 10,
    avgManagementSatisfaction: Math.round(avgManagementSatisfaction * 10) / 10,
    
    topExitReasons: exitTrends.topReasons,
    rehireEligibilityRate: Math.round(rehireEligibilityRate),
    
    turnoverRate: Math.round(turnoverRate * 10) / 10,
    voluntaryTurnoverRate: Math.round(voluntaryTurnoverRate * 10) / 10,
  };
}
