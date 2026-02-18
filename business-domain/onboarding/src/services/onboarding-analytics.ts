import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { ChecklistItem, OnboardingPlan } from './plan-management';

export interface ActionItem {
  action: string;
  owner: string;
  dueDate: Date;
  completed: boolean;
}

export interface FeedbackSession {
  sessionId: string;
  
  sessionDate: Date;
  sessionType: 'CHECK_IN' | 'ONE_WEEK' | 'ONE_MONTH' | 'THREE_MONTH' | 'SIX_MONTH';
  
  employee: string;
  manager: string;
  hrRep?: string;
  
  performanceFeedback: string;
  integrationFeedback: string;
  concernsRaised: string[];
  
  employeeSatisfaction?: number;
  managerAssessment?: number;
  
  actionItems: ActionItem[];
  
  meetingNotes?: string;
  documentUrl?: string;
  
  completed: boolean;
}

export interface OnboardingMetrics {
  period: { start: Date; end: Date };
  
  totalNewHires: number;
  onboardingInProgress: number;
  onboardingCompleted: number;
  
  avgCompletionTime: number;
  onTimeCompletionRate: number;
  
  avgTaskCompletionRate: number;
  criticalTasksCompletionRate: number;
  
  avgTrainingCompletionRate: number;
  avgTrainingDuration: number;
  
  avgEmployeeSatisfaction: number;
  avgManagerSatisfaction: number;
  
  thirtyDayRetention: number;
  ninetyDayRetention: number;
  
  avgTimeToProductivity: number;
}

export async function recordFeedbackSession(
  _db: NeonHttpDatabase,
  _orgId: string,
  _session: Omit<FeedbackSession, 'sessionId'>
): Promise<FeedbackSession> {
  throw new Error('Not implemented');
}

export function calculateCompletionPercentage(
  completedTasks: number,
  totalTasks: number
): number {
  if (totalTasks === 0) return 0;
  return Math.round((completedTasks / totalTasks) * 100);
}

export function identifyDelayedTasks(
  checklist: ChecklistItem[]
): ChecklistItem[] {
  const today = new Date();
  
  return checklist
    .filter(task => !task.isCompleted && task.dueDate < today)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}

export function identifyCriticalGaps(
  plan: OnboardingPlan
): {
  missingCriticalTasks: ChecklistItem[];
  incompleteTraining: string[];
  missedFeedbackSessions: string[];
} {
  const allTasks = [
    ...plan.preboarding,
    ...plan.dayOne,
    ...plan.firstWeek,
    ...plan.firstMonth,
    ...plan.firstQuarter,
  ];
  
  const missingCriticalTasks = allTasks.filter(task => 
    task.isCritical && !task.isCompleted && task.dueDate < new Date()
  );
  
  const incompleteTraining = plan.requiredTraining.filter(training => 
    !plan.completedTraining.includes(training)
  );
  
  const today = new Date();
  const missedFeedbackSessions = plan.feedbackSessions
    .filter(session => !session.completed && session.sessionDate < today)
    .map(session => session.sessionType);
  
  return {
    missingCriticalTasks,
    incompleteTraining,
    missedFeedbackSessions,
  };
}

export function calculateTimeToProductivity(
  plan: OnboardingPlan,
  productivityMilestone: string
): number {
  const task = [
    ...plan.preboarding,
    ...plan.dayOne,
    ...plan.firstWeek,
    ...plan.firstMonth,
    ...plan.firstQuarter,
  ].find(t => t.taskName === productivityMilestone);
  
  if (!task || !task.completedDate) return 0;
  
  const days = Math.ceil(
    (task.completedDate.getTime() - plan.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  return days;
}

export function analyzeOnboardingMetrics(
  plans: OnboardingPlan[],
  feedbackSessions: FeedbackSession[]
): OnboardingMetrics {
  const totalNewHires = plans.length;
  const onboardingInProgress = plans.filter(p => p.status === 'IN_PROGRESS').length;
  const onboardingCompleted = plans.filter(p => p.status === 'COMPLETED').length;
  
  const completedPlans = plans.filter(p => p.actualCompletionDate);
  let totalDays = 0;
  completedPlans.forEach(p => {
    if (p.actualCompletionDate) {
      const days = (p.actualCompletionDate.getTime() - p.startDate.getTime()) / (1000 * 60 * 60 * 24);
      totalDays += days;
    }
  });
  const avgCompletionTime = completedPlans.length > 0 ? totalDays / completedPlans.length : 0;
  
  const onTimeCompleted = completedPlans.filter(p => 
    p.actualCompletionDate && p.actualCompletionDate <= p.completionTargetDate
  ).length;
  const onTimeCompletionRate = completedPlans.length > 0 
    ? (onTimeCompleted / completedPlans.length) * 100 
    : 0;
  
  const totalTaskCompletion = plans.reduce((sum, p) => sum + p.completionPercentage, 0);
  const avgTaskCompletionRate = plans.length > 0 ? totalTaskCompletion / plans.length : 0;
  
  const totalTraining = plans.reduce((sum, p) => sum + p.requiredTraining.length, 0);
  const completedTraining = plans.reduce((sum, p) => sum + p.completedTraining.length, 0);
  const avgTrainingCompletionRate = totalTraining > 0 ? (completedTraining / totalTraining) * 100 : 0;
  
  const employeeSatisfactions = feedbackSessions
    .map(s => s.employeeSatisfaction)
    .filter((s): s is number => s !== undefined);
  const avgEmployeeSatisfaction = employeeSatisfactions.length > 0
    ? employeeSatisfactions.reduce((sum, s) => sum + s, 0) / employeeSatisfactions.length
    : 0;
  
  const managerAssessments = feedbackSessions
    .map(s => s.managerAssessment)
    .filter((a): a is number => a !== undefined);
  const avgManagerSatisfaction = managerAssessments.length > 0
    ? managerAssessments.reduce((sum, a) => sum + a, 0) / managerAssessments.length
    : 0;
  
  return {
    period: { start: new Date(), end: new Date() },
    
    totalNewHires,
    onboardingInProgress,
    onboardingCompleted,
    
    avgCompletionTime: Math.round(avgCompletionTime),
    onTimeCompletionRate: Math.round(onTimeCompletionRate),
    
    avgTaskCompletionRate: Math.round(avgTaskCompletionRate),
    criticalTasksCompletionRate: 0,
    
    avgTrainingCompletionRate: Math.round(avgTrainingCompletionRate),
    avgTrainingDuration: 0,
    
    avgEmployeeSatisfaction: Math.round(avgEmployeeSatisfaction * 10) / 10,
    avgManagerSatisfaction: Math.round(avgManagerSatisfaction * 10) / 10,
    
    thirtyDayRetention: 0,
    ninetyDayRetention: 0,
    
    avgTimeToProductivity: 0,
  };
}
