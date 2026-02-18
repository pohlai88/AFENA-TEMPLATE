import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface Project {
  id: string;
  orgId: string;
  projectNumber: string;
  projectName: string;
  customerId?: string;
  projectType: 'TIME_AND_MATERIALS' | 'FIXED_PRICE' | 'COST_PLUS';
  startDate: Date;
  endDate: Date;
  status: 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  budgetAmount: number;
  contractValue?: number;
  projectManager: string;
}

export interface ProjectCost {
  id: string;
  projectId: string;
  costDate: Date;
  costType: 'LABOR' | 'MATERIALS' | 'EQUIPMENT' | 'SUBCONTRACTOR' | 'OTHER';
  description: string;
  amount: number;
  billable: boolean;
  invoiced: boolean;
  employeeId?: string;
  hours?: number;
}

export async function createProject(
  db: NeonHttpDatabase,
  data: Omit<Project, 'id' | 'projectNumber' | 'status'>,
): Promise<Project> {
  // TODO: Generate project number and insert with PLANNING status
  throw new Error('Database integration pending');
}

export async function recordProjectCost(
  db: NeonHttpDatabase,
  data: Omit<ProjectCost, 'id' | 'invoiced'>,
): Promise<ProjectCost> {
  // TODO: Insert project cost with invoiced = false
  throw new Error('Database integration pending');
}

export async function getProjectFinancials(
  db: NeonHttpDatabase,
  projectId: string,
): Promise<{
    totalCosts: number;
    billableCosts: number;
    invoicedAmount: number;
    profitMargin: number;
  }> {
  // TODO: Calculate project financials
  throw new Error('Database integration pending');
}

export function calculateProjectPerformance(
  project: Project,
  costs: ProjectCost[],
): {
  totalCosts: number;
  budgetVariance: number;
  percentComplete: number;
  estimatedAtCompletion: number;
  profitability: number;
} {
  const totalCosts = costs.reduce((sum, cost) => sum + cost.amount, 0);
  const budgetVariance = project.budgetAmount - totalCosts;

  // Calculate percent complete based on costs (simplified)
  const percentComplete = project.budgetAmount > 0 
    ? Math.min(100, (totalCosts / project.budgetAmount) * 100) 
    : 0;

  // Estimate at completion (EAC)
  const estimatedAtCompletion = percentComplete > 0 
    ? totalCosts / (percentComplete / 100) 
    : project.budgetAmount;

  // Profitability for fixed price projects
  const profitability = project.contractValue 
    ? project.contractValue - estimatedAtCompletion 
    : 0;

  return {
    totalCosts,
    budgetVariance,
    percentComplete,
    estimatedAtCompletion,
    profitability,
  };
}

export function calculateLaborUtilization(
  costs: ProjectCost[],
  periodStart: Date,
  periodEnd: Date,
): { totalHours: number; billableHours: number; utilizationRate: number } {
  const laborCosts = costs.filter(
    (c) => c.costType === 'LABOR' && 
    c.costDate >= periodStart && 
    c.costDate <= periodEnd,
  );

  const totalHours = laborCosts.reduce((sum, cost) => sum + (cost.hours || 0), 0);
  const billableHours = laborCosts
    .filter((c) => c.billable)
    .reduce((sum, cost) => sum + (cost.hours || 0), 0);

  const utilizationRate = totalHours > 0 ? (billableHours / totalHours) * 100 : 0;

  return { totalHours, billableHours, utilizationRate };
}

export function identifyAtRiskProjects(
  projects: Array<Project & { totalCosts: number; percentComplete: number }>,
): Array<{
    project: Project;
    riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    reasons: string[];
  }> {
  return projects.map((project) => {
    const reasons: string[] = [];
    let riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';

    // Budget overrun
    if (project.totalCosts > project.budgetAmount) {
      reasons.push(`Over budget by ${((project.totalCosts / project.budgetAmount - 1) * 100).toFixed(1)}%`);
      riskLevel = 'HIGH';
    }

    // Behind schedule
    const daysRemaining = Math.floor((project.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (project.percentComplete < 80 && daysRemaining < 14) {
      reasons.push(`Only ${project.percentComplete.toFixed(0)}% complete with ${daysRemaining} days remaining`);
      if (riskLevel !== 'HIGH') riskLevel = 'MEDIUM';
    }

    return { project, riskLevel, reasons };
  }).filter((item) => item.riskLevel !== 'LOW');
}
