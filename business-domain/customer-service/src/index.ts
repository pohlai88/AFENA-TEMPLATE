/**
 * Customer Service Package
 * Customer service and case management with SLA tracking, escalations, and analytics
 */

// Case Management
export type { Case, CaseAssignment, CaseSearchResult } from './services/case-management.js';
export { createCase, updateCase, assignCase, searchCases } from './services/case-management.js';

// SLA Tracking
export type { SLA, SLACompliance, SLAMetrics, SLAReport } from './services/sla-tracking.js';
export {
  defineSLA,
  trackSLACompliance,
  calculateSLAMetrics,
  getSLAReport,
} from './services/sla-tracking.js';

// Escalations
export type {
  CaseEscalation,
  EscalationRule,
  EscalationProcessing,
  EscalationHistory,
} from './services/escalations.js';
export {
  escalateCase,
  defineEscalationRules,
  processEscalation,
  getEscalationHistory,
} from './services/escalations.js';

// Knowledge Base
export type {
  KnowledgeArticle,
  KnowledgeSearchResult,
  ArticleCaseLink,
  ArticleMetrics,
} from './services/knowledge-base.js';
export {
  createArticle,
  searchKnowledge,
  linkToCase,
  getArticleMetrics,
} from './services/knowledge-base.js';

// Service Analytics
export type {
  CaseMetrics,
  ResolutionTimeAnalysis,
  CSATScore,
  ServiceDashboard,
} from './services/service-analytics.js';
export {
  getCaseMetrics,
  analyzeResolutionTime,
  getCSATScore,
  getServiceDashboard,
} from './services/service-analytics.js';
