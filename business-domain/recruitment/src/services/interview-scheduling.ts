import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface Interviewer {
  userId: string;
  name: string;
  role: string;
  isPrimaryInterviewer: boolean;
  feedbackSubmitted: boolean;
}

export interface Interview {
  interviewId: string;
  
  // Candidate & Req
  candidateId: string;
  candidateName: string;
  requisitionId: string;
  jobTitle: string;
  
  // Type
  interviewType: 'PHONE_SCREEN' | 'VIDEO' | 'ONSITE' | 'PANEL' | 'TECHNICAL' | 'BEHAVIORAL';
  
  // Scheduling
  scheduledDate: Date;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  timezone: string;
  
  // Location/Platform
  location?: string;
  meetingLink?: string;
  
  // Participants
  interviewers: Interviewer[];
  
  // Preparation
  interviewGuideUrl?: string;
  questionsToAsk: string[];
  
  // Evaluation
  completed: boolean;
  feedbackSubmitted: boolean;
  rating?: number;
  recommendation?: 'STRONG_YES' | 'YES' | 'MAYBE' | 'NO' | 'STRONG_NO';
  
  // Notes
  interviewNotes?: string;
  strengths: string[];
  concerns: string[];
  
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
}

export async function scheduleInterview(
  _db: NeonHttpDatabase,
  _orgId: string,
  _interview: Omit<Interview, 'interviewId' | 'completed' | 'feedbackSubmitted'>
): Promise<Interview> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}
