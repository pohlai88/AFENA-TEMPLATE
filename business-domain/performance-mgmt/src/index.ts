/**
 * @afenda-performance-mgmt
 * 
 * Enterprise performance management and review system.
 */

export {
  createPerformanceReview,
  submitReview,
  type PerformanceReview,
  type ReviewSubmission,
} from './services/reviews.js';

export {
  setGoal,
  trackGoalProgress,
  type Goal,
  type GoalProgress,
} from './services/goals.js';

export {
  assessCompetency,
  defineCompetencyModel,
  type CompetencyAssessment,
  type CompetencyModel,
} from './services/competencies.js';

export {
  initiate360Feedback,
  aggregate360Results,
  type Feedback360,
  type FeedbackResults,
} from './services/feedback-360.js';

export {
  analyzePerformanceDistribution,
  identifyHighPerformers,
  type PerformanceDistribution,
  type HighPerformer,
} from './services/performance-analytics.js';
