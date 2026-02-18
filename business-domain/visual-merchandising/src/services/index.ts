/**
 * Visual Merchandising Services
 * Barrel export for all visual merchandising service modules
 */

// Display Planning
export * from './display-planning.js';

// Merchandise Presentation
export * from './merchandise-presentation.js';

// Window Display
export * from './window-display.js';

// Signage Management
export * from './signage-management.js';

// Merchandising Analytics
// Export only unique types from merchandising-analytics, excluding duplicates
export type {
  PlanogramCompliance,
  CorrectiveAction,
  ComplianceInspection,
  VMPerformance,
  SalesLiftAnalysis,
} from './merchandising-analytics.js';
export {
  conductComplianceInspection,
  getComplianceInspection,
  listComplianceInspections,
  getVMPerformance,
  calculateSalesLift,
  calculatePlanogramCompliance,
  analyzeVMPerformance,
  analyzeSalesLift,
} from './merchandising-analytics.js';
