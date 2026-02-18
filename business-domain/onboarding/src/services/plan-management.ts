import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface ChecklistItem {
  taskId: string;
  taskName: string;
  description: string;
  
  assignedTo: 'EMPLOYEE' | 'HR' | 'MANAGER' | 'IT' | 'FACILITIES';
  responsiblePerson?: string;
  
  dueDate: Date;
  completedDate?: Date;
  
  instructions?: string;
  relatedDocuments: string[];
  
  isCompleted: boolean;
  isCritical: boolean;
  
  notes?: string;
}

export interface OnboardingPlan {
  planId: string;
  
  employeeId: string;
  employeeName: string;
  jobTitle: string;
  department: string;
  
  startDate: Date;
  orientationDate: Date;
  completionTargetDate: Date;
  actualCompletionDate?: Date;
  
  hiringManager: string;
  buddy?: string;
  hrContact: string;
  
  preboarding: ChecklistItem[];
  dayOne: ChecklistItem[];
  firstWeek: ChecklistItem[];
  firstMonth: ChecklistItem[];
  firstQuarter: ChecklistItem[];
  
  totalTasks: number;
  completedTasks: number;
  completionPercentage: number;
  
  requiredTraining: string[];
  completedTraining: string[];
  
  equipmentAssigned: import('./equipment-provisioning').EquipmentAssignment[];
  
  feedbackSessions: import('./onboarding-analytics').FeedbackSession[];
  
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
}

export async function createOnboardingPlan(
  _db: NeonHttpDatabase,
  _orgId: string,
  _plan: Omit<OnboardingPlan, 'planId' | 'totalTasks' | 'completedTasks' | 'completionPercentage'>
): Promise<OnboardingPlan> {
  throw new Error('Not implemented');
}

export function generateOnboardingChecklist(
  _jobTitle: string,
  _department: string,
  startDate: Date
): {
  preboarding: ChecklistItem[];
  dayOne: ChecklistItem[];
  firstWeek: ChecklistItem[];
  firstMonth: ChecklistItem[];
} {
  const preboarding: ChecklistItem[] = [
    {
      taskId: '1',
      taskName: 'Send welcome email',
      description: 'Send welcome email with start date and first day details',
      assignedTo: 'HR',
      dueDate: new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000),
      isCompleted: false,
      isCritical: true,
      relatedDocuments: [],
    },
    {
      taskId: '2',
      taskName: 'Prepare workstation',
      description: 'Set up desk, computer, and equipment',
      assignedTo: 'IT',
      dueDate: new Date(startDate.getTime() - 1 * 24 * 60 * 60 * 1000),
      isCompleted: false,
      isCritical: true,
      relatedDocuments: [],
    },
  ];
  
  const dayOne: ChecklistItem[] = [
    {
      taskId: '3',
      taskName: 'Complete new hire paperwork',
      description: 'Tax forms, direct deposit, emergency contacts',
      assignedTo: 'EMPLOYEE',
      dueDate: startDate,
      isCompleted: false,
      isCritical: true,
      relatedDocuments: [],
    },
    {
      taskId: '4',
      taskName: 'Attend orientation session',
      description: 'Company overview and culture',
      assignedTo: 'EMPLOYEE',
      dueDate: startDate,
      isCompleted: false,
      isCritical: true,
      relatedDocuments: [],
    },
  ];
  
  const firstWeek: ChecklistItem[] = [
    {
      taskId: '5',
      taskName: 'Complete compliance training',
      description: 'Required regulatory and safety training',
      assignedTo: 'EMPLOYEE',
      dueDate: new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000),
      isCompleted: false,
      isCritical: true,
      relatedDocuments: [],
    },
  ];
  
  const firstMonth: ChecklistItem[] = [
    {
      taskId: '6',
      taskName: '30-day check-in',
      description: 'Manager 1-on-1 to review progress',
      assignedTo: 'MANAGER',
      dueDate: new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000),
      isCompleted: false,
      isCritical: true,
      relatedDocuments: [],
    },
  ];
  
  return {
    preboarding,
    dayOne,
    firstWeek,
    firstMonth,
  };
}
