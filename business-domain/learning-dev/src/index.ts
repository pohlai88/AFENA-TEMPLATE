/**
 * @afenda-learning-dev
 * 
 * Enterprise learning and development management.
 */

export {
  enrollInTraining,
  completeTraining,
  type TrainingEnrollment,
  type TrainingCompletion,
} from './services/training.js';

export {
  awardCertification,
  trackCertificationExpiry,
  type CertificationAward,
  type ExpiringCertification,
} from './services/certifications.js';

export {
  createCareerPath,
  assessPathProgress,
  type CareerPath,
  type PathProgress,
} from './services/career-paths.js';

export {
  conductAssessment,
  identifySkillGaps,
  type SkillAssessment,
  type SkillGap,
} from './services/skill-assessments.js';

export {
  analyzeTrainingEffectiveness,
  trackLearningProgress,
  type TrainingEffectiveness,
  type LearningProgress,
} from './services/learning-analytics.js';
