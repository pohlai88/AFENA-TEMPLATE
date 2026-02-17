/**
 * Financial Close Package
 * Month-end/quarter-end close automation and tracking
 */

// Close Calendar
export type {
  CloseCalendar,
  CloseCalendarList,
  CloseStatusUpdate,
  TaskTemplate,
} from './services/close-calendar.js';
export {
  createCloseCalendar,
  getCloseCalendars,
  updateCloseStatus,
  createTaskTemplate,
} from './services/close-calendar.js';

// Task Management
export type {
  CloseTask,
  TaskStatusUpdate,
  MyTasks,
  CalendarTasks,
} from './services/task-management.js';
export {
  assignCloseTask,
  updateTaskStatus,
  getMyTasks,
  getCalendarTasks,
} from './services/task-management.js';

// Reconciliations
export type {
  Reconciliation,
  ReconciliationReview,
  ReconciliationStatus,
  MyReconciliations,
} from './services/reconciliations.js';
export {
  submitReconciliation,
  reviewReconciliation,
  getReconciliationStatus,
  getMyReconciliations,
} from './services/reconciliations.js';

// Approvals
export type {
  CloseApproval,
  ApprovalStatus,
  CloseChecklist,
  ChecklistItemCompletion,
} from './services/approvals.js';
export {
  approveClosePeriod,
  getApprovalStatus,
  createChecklist,
  completeChecklistItem,
} from './services/approvals.js';

// Close Analytics
export type {
  CloseMetrics,
  CycleTimeAnalysis,
  TaskPerformance,
  CloseDashboard,
} from './services/close-analytics.js';
export {
  getCloseMetrics,
  getCycleTimeAnalysis,
  getTaskPerformance,
  getCloseDashboard,
} from './services/close-analytics.js';
