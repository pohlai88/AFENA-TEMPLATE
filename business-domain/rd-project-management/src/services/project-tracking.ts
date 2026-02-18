import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface RDProject {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  targetCompletionDate: Date;
  status: 'CONCEPT' | 'APPROVED' | 'IN_PROGRESS' | 'TESTING' | 'COMPLETED' | 'ON_HOLD';
  budget: number;
  spentToDate: number;
  team: Array<{ memberId: string; role: string }>;
  milestones: Array<{
    name: string;
    targetDate: Date;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  }>;
}

export async function createProject(
  db: NeonHttpDatabase,
  data: Omit<RDProject, 'id' | 'status' | 'spentToDate'>,
): Promise<RDProject> {
  // TODO: Insert into database with CONCEPT status
  throw new Error('Database integration pending');
}

export async function getProjects(
  db: NeonHttpDatabase,
  status?: RDProject['status'],
): Promise<RDProject[]> {
  // TODO: Query database with optional status filter
  throw new Error('Database integration pending');
}

export function calculateProjectHealth(project: RDProject): {
  health: 'GREEN' | 'YELLOW' | 'RED';
  budgetVariance: number;
  scheduleVariance: number;
  risks: string[];
} {
  const risks: string[] = [];

  // Budget variance
  const budgetVariance = ((project.spentToDate - project.budget) / project.budget) * 100;
  if (budgetVariance > 10) {
    risks.push(`Over budget by ${budgetVariance.toFixed(1)}%`);
  }

  // Schedule variance
  const now = Date.now();
  const totalDuration =
    project.targetCompletionDate.getTime() - project.startDate.getTime();
  const elapsed = now - project.startDate.getTime();
  const elapsedPercentage = (elapsed / totalDuration) * 100;

  const completedMilestones = project.milestones.filter(
    (m) => m.status === 'COMPLETED',
  ).length;
  const completionPercentage =
    (completedMilestones / project.milestones.length) * 100;

  const scheduleVariance = elapsedPercentage - completionPercentage;
  if (scheduleVariance > 15) {
    risks.push(`Behind schedule by ${scheduleVariance.toFixed(1)}%`);
  }

  // Overall health
  let health: 'GREEN' | 'YELLOW' | 'RED' = 'GREEN';
  if (risks.length === 0) health = 'GREEN';
  else if (risks.length === 1 || (budgetVariance <= 20 && scheduleVariance <= 25)) {
    health = 'YELLOW';
  } else health = 'RED';

  return { health, budgetVariance, scheduleVariance, risks };
}

export function prioritizeProjects(
  projects: Array<RDProject & { strategicValue: number; feasibility: number }>,
): Array<{
  project: RDProject;
  score: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}> {
  return projects
    .map((project) => {
      const score = project.strategicValue * 0.6 + project.feasibility * 0.4;
      const priority: 'HIGH' | 'MEDIUM' | 'LOW' =
        score >= 75 ? 'HIGH' : score >= 50 ? 'MEDIUM' : 'LOW';

      return { project, score, priority };
    })
    .sort((a, b) => b.score - a.score);
}
