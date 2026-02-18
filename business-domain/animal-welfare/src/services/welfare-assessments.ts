import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface WelfareAssessment {
  id: string;
  facilityId: string;
  assessmentDate: Date;
  assessor: string;
  species: string;
  categories: Array<{
    name: string;
    score: number;
    maxScore: number;
    observations: string;
  }>;
  overallScore: number;
  certificationLevel: 'CERTIFIED_HUMANE' | 'ANIMAL_WELFARE_APPROVED' | 'GAP_CERTIFIED' | 'NOT_CERTIFIED';
}

export function createAssessment(
  _db: NeonHttpDatabase,
  _data: Omit<WelfareAssessment, 'id' | 'overallScore'>,
): WelfareAssessment {
  // TODO: Calculate overall score and insert
  throw new Error('Database integration pending');
}

export function getAssessments(
  _db: NeonHttpDatabase,
  _facilityId: string,
  _dateFrom?: Date,
): WelfareAssessment[] {
  // TODO: Query database
  throw new Error('Database integration pending');
}

export function calculateWelfareScore(
  categories: WelfareAssessment['categories'],
): {
  score: number;
  level: 'EXCELLENT' | 'GOOD' | 'ACCEPTABLE' | 'NEEDS_IMPROVEMENT';
} {
  const totalScore = categories.reduce((sum, c) => sum + c.score, 0);
  const maxScore = categories.reduce((sum, c) => sum + c.maxScore, 0);

  const scorePercentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

  let level: 'EXCELLENT' | 'GOOD' | 'ACCEPTABLE' | 'NEEDS_IMPROVEMENT' = 'ACCEPTABLE';
  if (scorePercentage >= 90) level = 'EXCELLENT';
  else if (scorePercentage >= 80) level = 'GOOD';
  else if (scorePercentage >= 70) level = 'ACCEPTABLE';
  else level = 'NEEDS_IMPROVEMENT';

  return { score: scorePercentage, level };
}

export function assessCertificationEligibility(
  assessment: WelfareAssessment,
): {
  eligible: boolean;
  certificationLevels: string[];
  requirements: string[];
} {
  const requirements: string[] = [];
  const certificationLevels: string[] = [];

  if (assessment.overallScore >= 90) {
    certificationLevels.push('CERTIFIED_HUMANE', 'ANIMAL_WELFARE_APPROVED');
  } else if (assessment.overallScore >= 80) {
    certificationLevels.push('GAP_CERTIFIED');
    requirements.push('Improve overall score to 90+ for higher certifications');
  } else {
    requirements.push('Minimum score of 80 required for certification');
    requirements.push('Address low-scoring categories');
  }

  return {
    eligible: certificationLevels.length > 0,
    certificationLevels,
    requirements,
  };
}
