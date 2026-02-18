import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface KnowledgeTransferPlan {
  planId: string;
  
  successorId?: string;
  successorName?: string;
  
  keyResponsibilities: string[];
  criticalProcesses: KnowledgeItem[];
  ongoingProjects: KnowledgeItem[];
  keyContacts: ContactHandover[];
  systemAccess: AccessHandover[];
  
  targetCompletionDate: Date;
  actualCompletionDate?: Date;
  
  handoverSessions: HandoverSession[];
  
  completionPercentage: number;
  isComplete: boolean;
}

export interface KnowledgeItem {
  itemType: 'PROCESS' | 'PROJECT' | 'SYSTEM' | 'RELATIONSHIP';
  title: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  
  documentationUrl?: string;
  documented: boolean;
  handedOver: boolean;
  
  notes?: string;
}

export interface ContactHandover {
  contactName: string;
  contactRole: string;
  relationship: string;
  
  importance: 'CRITICAL' | 'IMPORTANT' | 'NORMAL';
  introducedToSuccessor: boolean;
  
  notes?: string;
}

export interface AccessHandover {
  systemName: string;
  accessLevel: string;
  
  credentials?: string;
  documentedInSecureLocation: boolean;
  
  transferRequired: boolean;
  transferredToSuccessor: boolean;
}

export interface HandoverSession {
  sessionDate: Date;
  duration: number;
  attendees: string[];
  
  topicsCovered: string[];
  questionsAddressed: string[];
  
  actionItems: string[];
  notes?: string;
}

export async function createKnowledgeTransferPlan(
  _db: NeonHttpDatabase,
  _orgId: string,
  _plan: Omit<KnowledgeTransferPlan, 'planId' | 'completionPercentage' | 'isComplete'>
): Promise<KnowledgeTransferPlan> {
  throw new Error('Not implemented');
}

export function identifyAtRiskKnowledge(
  plan: KnowledgeTransferPlan
): {
  undocumentedProcesses: KnowledgeItem[];
  criticalHandovers: KnowledgeItem[];
  missingSuccessor: boolean;
} {
  const undocumentedProcesses = [
    ...plan.criticalProcesses,
    ...plan.ongoingProjects,
  ].filter(item => !item.documented && item.priority === 'HIGH');
  
  const criticalHandovers = [
    ...plan.criticalProcesses,
    ...plan.ongoingProjects,
  ].filter(item => item.priority === 'HIGH' && !item.handedOver);
  
  const missingSuccessor = !plan.successorId;
  
  return {
    undocumentedProcesses,
    criticalHandovers,
    missingSuccessor,
  };
}
