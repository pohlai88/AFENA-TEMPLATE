import type { Candidate } from './candidate-management';
import type { JobRequisition } from './requisition-management';
import type { Interview } from './interview-scheduling';

export function calculateScreeningScore(
  candidate: Candidate,
  requisition: JobRequisition
): number {
  let score = 0;
  
  // Experience match (0-30 points)
  const requiredYears = requisition.seniorityLevel === 'ENTRY' ? 0 :
                        requisition.seniorityLevel === 'INTERMEDIATE' ? 3 :
                        requisition.seniorityLevel === 'SENIOR' ? 7 : 10;
  
  if (candidate.yearsOfExperience >= requiredYears) {
    score += 30;
  } else {
    score += (candidate.yearsOfExperience / requiredYears) * 30;
  }
  
  // Keyword match (0-40 points)
  const keywordScore = Math.min(candidate.keywordMatches.length * 5, 40);
  score += keywordScore;
  
  // Education (0-20 points)
  const hasRelevantDegree = candidate.education.some(edu => 
    requisition.requiredQualifications.some(qual => 
      qual.toLowerCase().includes(edu.degree.toLowerCase()) ||
      qual.toLowerCase().includes(edu.field.toLowerCase())
    )
  );
  score += hasRelevantDegree ? 20 : 10;
  
  // Source quality bonus (0-10 points)
  if (['REFERRAL', 'RECRUITER'].includes(candidate.source)) {
    score += 10;
  } else if (candidate.source === 'COMPANY_WEBSITE') {
    score += 5;
  }
  
  return Math.round(Math.min(score, 100));
}

export function identifyTopCandidates(
  candidates: Candidate[],
  interviews: Interview[]
): Array<{
    candidateId: string;
    name: string;
    stage: string;
    avgRating: number;
    interviewCount: number;
  }> {
  return candidates
    .filter(c => c.status === 'ACTIVE' && c.overallRating !== undefined)
    .map(c => {
      const candidateInterviews = interviews.filter(i => i.candidateId === c.candidateId);
      const avgRating = c.overallRating || 0;
      
      return {
        candidateId: c.candidateId,
        name: `${c.firstName} ${c.lastName}`,
        stage: c.currentStage,
        avgRating,
        interviewCount: candidateInterviews.length,
      };
    })
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 10);
}
