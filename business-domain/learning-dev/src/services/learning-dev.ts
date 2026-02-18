/**
 * Learning & Development - manages training programs, certifications, skill tracking
 */

export interface TrainingProgram {
  programId: string;
  programName: string;
  programType: 'ONBOARDING' | 'COMPLIANCE' | 'TECHNICAL' | 'LEADERSHIP' | 'PROFESSIONAL';
  duration: number; // hours
  format: 'CLASSROOM' | 'ELEARNING' | 'BLENDED' | 'ON_THE_JOB';
  isRequired: boolean;
  expirationMonths?: number;
}

export interface Enrollment {
  enrollmentId: string;
  employeeId: string;
  programId: string;
  status: 'ENROLLED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'EXPIRED';
  enrolledDate: Date;
  completedDate?: Date;
  score?: number;
  expirationDate?: Date;
}

export interface Certification {
  certificationId: string;
  certificationName: string;
  issuingBody: string;
  validityPeriod?: number; // months
  requiredFor: string[]; // Job roles
}

export interface SkillGap {
  employeeId: string;
  requiredSkills: string[];
  currentSkills: string[];
  gaps: string[];
  recommendedPrograms: string[];
}

export async function createProgram(program: Omit<TrainingProgram, 'programId'>): Promise<TrainingProgram> {
  // TODO: Drizzle ORM
  throw new Error('Not implemented');
}

export function calculateCompletionRate(enrollments: Enrollment[]): number {
  if (enrollments.length === 0) return 0;
  const completed = enrollments.filter(e => e.status === 'COMPLETED').length;
  return Math.round((completed / enrollments.length) * 100);
}

export function identifySkillGaps(
  employeeId: string,
  currentSkills: string[],
  requiredSkills: string[]
): SkillGap {
  const gaps = requiredSkills.filter(skill => !currentSkills.includes(skill));
  
  return {
    employeeId,
    requiredSkills,
    currentSkills,
    gaps,
    recommendedPrograms: [], // Would match gaps to programs
  };
}
