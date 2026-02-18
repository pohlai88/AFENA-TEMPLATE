import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface BenefitPlan {
  id: string;
  orgId: string;
  planName: string;
  planType: 'HEALTH' | 'DENTAL' | 'VISION' | 'LIFE' | 'DISABILITY' | '401K' | 'HSA' | 'FSA';
  carrier?: string;
  policyNumber?: string;
  status: 'ACTIVE' | 'INACTIVE';
  employeeContribution: number;
  employerContribution: number;
  contributionType: 'FIXED' | 'PERCENTAGE';
}

export interface BenefitEnrollment {
  id: string;
  employeeId: string;
  planId: string;
  enrollmentDate: Date;
  effectiveDate: Date;
  status: 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'TERMINATED';
  employeeContribution: number;
  employerContribution: number;
  dependents?: Array<{
    name: string;
    relationship: string;
    dateOfBirth: Date;
  }>;
}

export async function createBenefitPlan(
  db: NeonHttpDatabase,
  data: Omit<BenefitPlan, 'id' | 'status'>,
): Promise<BenefitPlan> {
  // TODO: Insert benefit plan with ACTIVE status
  throw new Error('Database integration pending');
}

export async function enrollEmployee(
  db: NeonHttpDatabase,
  data: Omit<BenefitEnrollment, 'id' | 'status'>,
): Promise<BenefitEnrollment> {
  // TODO: Insert enrollment with PENDING status
  throw new Error('Database integration pending');
}

export async function getEmployeeBenefits(
  db: NeonHttpDatabase,
  employeeId: string,
): Promise<BenefitEnrollment[]> {
  // TODO: Query all active enrollments for employee
  throw new Error('Database integration pending');
}

export async function cancelEnrollment(
  db: NeonHttpDatabase,
  enrollmentId: string,
  terminationDate: Date,
): Promise<BenefitEnrollment> {
  // TODO: Update enrollment status to CANCELLED
  throw new Error('Database integration pending');
}

export function calculateContribution(
  plan: BenefitPlan,
  baseSalary: number,
): { employeeContribution: number; employerContribution: number } {
  let employeeContribution: number;
  let employerContribution: number;

  if (plan.contributionType === 'FIXED') {
    employeeContribution = plan.employeeContribution;
    employerContribution = plan.employerContribution;
  } else {
    // Percentage of salary
    employeeContribution = baseSalary * (plan.employeeContribution / 100);
    employerContribution = baseSalary * (plan.employerContribution / 100);
  }

  return { employeeContribution, employerContribution };
}

export function validate401kContribution(
  employeeContribution: number,
  compensation: number,
  year: number = 2026,
): { valid: boolean; maxContribution: number; warnings: string[] } {
  const warnings: string[] = [];
  const maxContribution = 23500; // 2026 IRS limit
  const maxPercentage = 100; // 100% of compensation

  if (employeeContribution > maxContribution) {
    warnings.push(`Contribution ${employeeContribution} exceeds annual limit ${maxContribution}`);
  }

  if (employeeContribution > compensation) {
    warnings.push('Contribution cannot exceed compensation');
  }

  return {
    valid: warnings.length === 0,
    maxContribution,
    warnings,
  };
}

export function calculateQualifyingEvent(
  eventType: 'MARRIAGE' | 'BIRTH' | 'ADOPTION' | 'LOSS_OF_COVERAGE' | 'EMPLOYMENT_CHANGE',
  eventDate: Date,
): { enrollmentDeadline: Date; effectiveDate: Date } {
  const enrollmentDeadline = new Date(eventDate);
  enrollmentDeadline.setDate(enrollmentDeadline.getDate() + 30); // 30-day window

  const effectiveDate = eventDate; // Coverage effective as of event date

  return { enrollmentDeadline, effectiveDate };
}

export function summarizeBenefitCosts(
  enrollments: Array<BenefitEnrollment & { plan: BenefitPlan }>,
): {
  totalEmployeeContribution: number;
  totalEmployerContribution: number;
  byPlanType: Map<string, { employee: number; employer: number }>;
} {
  let totalEmployeeContribution = 0;
  let totalEmployerContribution = 0;
  const byPlanType = new Map<string, { employee: number; employer: number }>();

  for (const enrollment of enrollments) {
    if (enrollment.status !== 'ACTIVE') continue;

    totalEmployeeContribution += enrollment.employeeContribution;
    totalEmployerContribution += enrollment.employerContribution;

    const current = byPlanType.get(enrollment.plan.planType) || { employee: 0, employer: 0 };
    byPlanType.set(enrollment.plan.planType, {
      employee: current.employee + enrollment.employeeContribution,
      employer: current.employer + enrollment.employerContribution,
    });
  }

  return { totalEmployeeContribution, totalEmployerContribution, byPlanType };
}
