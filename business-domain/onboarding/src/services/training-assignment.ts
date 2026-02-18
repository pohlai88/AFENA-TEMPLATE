import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface TrainingModule {
  moduleId: string;
  
  moduleName: string;
  category: 'COMPLIANCE' | 'SYSTEMS' | 'PRODUCT' | 'PROCESS' | 'PROFESSIONAL_DEVELOPMENT';
  
  description: string;
  learningObjectives: string[];
  
  deliveryMethod: 'ELEARNING' | 'INSTRUCTOR_LED' | 'ON_THE_JOB' | 'SELF_PACED';
  duration: number;
  
  contentUrl?: string;
  materials: string[];
  
  hasAssessment: boolean;
  passingScore?: number;
  
  isMandatory: boolean;
  requiredForRoles: string[];
  
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export interface TrainingCompletion {
  completionId: string;
  
  employeeId: string;
  employeeName: string;
  
  moduleId: string;
  moduleName: string;
  
  startDate: Date;
  completionDate?: Date;
  
  assessmentScore?: number;
  passed: boolean;
  attempts: number;
  
  certificateUrl?: string;
  expiryDate?: Date;
  
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
}

export async function assignTraining(
  _db: NeonHttpDatabase,
  _orgId: string,
  _employeeId: string,
  _moduleId: string
): Promise<TrainingCompletion> {
  throw new Error('Not implemented');
}
