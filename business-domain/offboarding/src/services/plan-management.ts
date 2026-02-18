import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { KnowledgeTransferPlan } from './knowledge-transfer.js';
import type { ClearanceItem } from './clearance.js';
import type { FinalPayment } from './alumni-management.js';

export interface OffboardingPlan {
  planId: string;
  
  employeeId: string;
  employeeName: string;
  jobTitle: string;
  department: string;
  
  exitType: 'RESIGNATION' | 'RETIREMENT' | 'TERMINATION' | 'END_OF_CONTRACT' | 'LAYOFF';
  exitReason?: string;
  lastWorkingDate: Date;
  noticeDate: Date;
  noticePeriod: number;
  
  manager: string;
  hrContact: string;
  
  exitChecklist: ChecklistItem[];
  totalTasks: number;
  completedTasks: number;
  completionPercentage: number;
  
  knowledgeTransferPlan?: KnowledgeTransferPlan;
  
  exitInterviewScheduled: boolean;
  exitInterviewDate?: Date;
  exitInterviewCompleted: boolean;
  
  clearanceItems: ClearanceItem[];
  clearanceComplete: boolean;
  
  resignationLetterUrl?: string;
  finalPayDetails?: FinalPayment;
  
  status: 'INITIATED' | 'IN_PROGRESS' | 'PENDING_CLEARANCE' | 'COMPLETED';
}

export interface ChecklistItem {
  taskId: string;
  taskName: string;
  description: string;
  
  assignedTo: 'EMPLOYEE' | 'HR' | 'MANAGER' | 'IT' | 'FACILITIES' | 'FINANCE';
  responsiblePerson?: string;
  
  dueDate: Date;
  completedDate?: Date;
  
  isCritical: boolean;
  isCompleted: boolean;
  
  notes?: string;
}

export async function initiateOffboarding(
  _db: NeonHttpDatabase,
  _orgId: string,
  _plan: Omit<OffboardingPlan, 'planId' | 'totalTasks' | 'completedTasks' | 'completionPercentage'>
): Promise<OffboardingPlan> {
  throw new Error('Not implemented');
}

export function generateOffboardingChecklist(
  _exitType: string,
  lastWorkingDate: Date
): ChecklistItem[] {
  const checklist: ChecklistItem[] = [
    {
      taskId: '1',
      taskName: 'Return company equipment',
      description: 'Laptop, phone, access card, keys',
      assignedTo: 'EMPLOYEE',
      dueDate: lastWorkingDate,
      isCompleted: false,
      isCritical: true,
    },
    {
      taskId: '2',
      taskName: 'Revoke system access',
      description: 'Disable all system and building access',
      assignedTo: 'IT',
      dueDate: lastWorkingDate,
      isCompleted: false,
      isCritical: true,
    },
    {
      taskId: '3',
      taskName: 'Exit interview',
      description: 'Conduct exit interview with HR',
      assignedTo: 'HR',
      dueDate: lastWorkingDate,
      isCompleted: false,
      isCritical: false,
    },
    {
      taskId: '4',
      taskName: 'Knowledge transfer',
      description: 'Complete handover of responsibilities',
      assignedTo: 'EMPLOYEE',
      dueDate: new Date(lastWorkingDate.getTime() - 5 * 24 * 60 * 60 * 1000),
      isCompleted: false,
      isCritical: true,
    },
    {
      taskId: '5',
      taskName: 'Process final payment',
      description: 'Calculate and process final paycheck',
      assignedTo: 'FINANCE',
      dueDate: new Date(lastWorkingDate.getTime() + 7 * 24 * 60 * 60 * 1000),
      isCompleted: false,
      isCritical: true,
    },
  ];
  
  return checklist;
}
