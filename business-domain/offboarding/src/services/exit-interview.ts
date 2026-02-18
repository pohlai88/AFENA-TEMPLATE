import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface ExitInterview {
  interviewId: string;
  
  employeeId: string;
  employeeName: string;
  department: string;
  tenure: number;
  
  interviewDate: Date;
  interviewer: string;
  
  exitReason: string;
  primaryReasonCategory: 'COMPENSATION' | 'CAREER_GROWTH' | 'MANAGEMENT' | 'CULTURE' | 
                        'WORK_LIFE_BALANCE' | 'RELOCATION' | 'RETIREMENT' | 'OTHER';
  
  jobSatisfaction?: number;
  managementSatisfaction?: number;
  cultureSatisfaction?: number;
  compensationSatisfaction?: number;
  careerDevelopmentSatisfaction?: number;
  workLifeBalanceSatisfaction?: number;
  
  whatWorkedWell: string[];
  areasForImprovement: string[];
  suggestionsForImprovement: string[];
  
  wouldRehire: boolean;
  wouldRecommendCompany: boolean;
  counterofferMade: boolean;
  counterofferAccepted?: boolean;
  
  willingToReturn: boolean;
  referralProgramInterest: boolean;
  
  confidentialNotes?: string;
  
  completed: boolean;
}

export async function conductExitInterview(
  _db: NeonHttpDatabase,
  _orgId: string,
  _interview: Omit<ExitInterview, 'interviewId'>
): Promise<ExitInterview> {
  throw new Error('Not implemented');
}

export function analyzeExitTrends(
  interviews: ExitInterview[]
): {
  topReasons: Array<{ reason: string; count: number; percentage: number }>;
  avgSatisfactionScores: {
    job: number;
    management: number;
    culture: number;
    compensation: number;
  };
  rehireWillingness: number;
  companyRecommendationRate: number;
} {
  const reasonMap = new Map<string, number>();
  interviews.forEach(interview => {
    const reason = interview.primaryReasonCategory;
    reasonMap.set(reason, (reasonMap.get(reason) || 0) + 1);
  });
  
  const total = interviews.length;
  const topReasons = Array.from(reasonMap.entries())
    .map(([reason, count]) => ({
      reason,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  const jobSatisfactions = interviews
    .map(i => i.jobSatisfaction)
    .filter((s): s is number => s !== undefined);
  const avgJob = jobSatisfactions.length > 0
    ? jobSatisfactions.reduce((sum, s) => sum + s, 0) / jobSatisfactions.length
    : 0;
  
  const managementSatisfactions = interviews
    .map(i => i.managementSatisfaction)
    .filter((s): s is number => s !== undefined);
  const avgManagement = managementSatisfactions.length > 0
    ? managementSatisfactions.reduce((sum, s) => sum + s, 0) / managementSatisfactions.length
    : 0;
  
  const cultureSatisfactions = interviews
    .map(i => i.cultureSatisfaction)
    .filter((s): s is number => s !== undefined);
  const avgCulture = cultureSatisfactions.length > 0
    ? cultureSatisfactions.reduce((sum, s) => sum + s, 0) / cultureSatisfactions.length
    : 0;
  
  const compensationSatisfactions = interviews
    .map(i => i.compensationSatisfaction)
    .filter((s): s is number => s !== undefined);
  const avgCompensation = compensationSatisfactions.length > 0
    ? compensationSatisfactions.reduce((sum, s) => sum + s, 0) / compensationSatisfactions.length
    : 0;
  
  const willingToReturn = interviews.filter(i => i.willingToReturn).length;
  const rehireWillingness = total > 0 ? (willingToReturn / total) * 100 : 0;
  
  const wouldRecommend = interviews.filter(i => i.wouldRecommendCompany).length;
  const companyRecommendationRate = total > 0 ? (wouldRecommend / total) * 100 : 0;
  
  return {
    topReasons,
    avgSatisfactionScores: {
      job: Math.round(avgJob * 10) / 10,
      management: Math.round(avgManagement * 10) / 10,
      culture: Math.round(avgCulture * 10) / 10,
      compensation: Math.round(avgCompensation * 10) / 10,
    },
    rehireWillingness: Math.round(rehireWillingness),
    companyRecommendationRate: Math.round(companyRecommendationRate),
  };
}
