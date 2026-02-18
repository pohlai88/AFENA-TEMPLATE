import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface JobRequisition {
  requisitionId: string;
  requisitionNumber: string;
  
  // Position details
  jobTitle: string;
  department: string;
  reportingTo: string;
  location: string;
  
  // Type
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'TEMPORARY' | 'INTERN';
  seniorityLevel: 'ENTRY' | 'INTERMEDIATE' | 'SENIOR' | 'LEAD' | 'EXECUTIVE';
  
  // Requirements
  jobDescription: string;
  keyResponsibilities: string[];
  requiredQualifications: string[];
  preferredQualifications: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  
  // Compensation
  salaryRangeMin: number;
  salaryRangeMax: number;
  currency: string;
  benefits: string[];
  
  // Headcount
  positionsToFill: number;
  positionsFilled: number;
  
  // Timeline
  openDate: Date;
  targetFillDate: Date;
  closeDate?: Date;
  
  // Approval
  requestedBy: string;
  approvedBy?: string;
  approvalDate?: Date;
  
  // Recruitment
  hiringManager: string;
  recruiter?: string;
  
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'OPEN' | 'ON_HOLD' | 'FILLED' | 'CANCELLED';
}

export async function createJobRequisition(
  _db: NeonHttpDatabase,
  _orgId: string,
  _requisition: Omit<JobRequisition, 'requisitionId' | 'requisitionNumber' | 'positionsFilled'>
): Promise<JobRequisition> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export function generateRequisitionNumber(department: string): string {
  const year = new Date().getFullYear();
  const deptCode = department.substring(0, 3).toUpperCase();
  const sequence = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `REQ-${year}-${deptCode}-${sequence}`;
}
