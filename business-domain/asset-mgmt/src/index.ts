/**
 * Asset Management Package
 * Enterprise asset management and maintenance with PM schedules, work orders, and analytics
 */

// Preventive Maintenance
export type {
  PMSchedule,
  PMExecution,
  PMScheduleUpdate,
  PMCalendarEntry,
} from './services/preventive-maintenance.js';
export {
  createPMSchedule,
  executePM,
  updatePMSchedule,
  getPMCalendar,
} from './services/preventive-maintenance.js';

// Work Requests
export type {
  WorkRequest,
  WorkOrderAssignment,
  WorkOrderCompletion,
  WorkOrderStatus,
} from './services/work-requests.js';
export {
  createWorkRequest,
  assignWorkOrder,
  completeWorkOrder,
  getWorkOrderStatus,
} from './services/work-requests.js';

// Spare Parts
export type {
  SparePartLink,
  PartsAvailability,
  PartsConsumption,
  PartsUsageReport,
} from './services/spare-parts.js';
export {
  linkSparePart,
  checkPartsAvailability,
  consumeParts,
  getPartsUsage,
} from './services/spare-parts.js';

// Calibration
export type {
  CalibrationSchedule,
  CalibrationRecord,
  Certification,
  CalibrationDueList,
} from './services/calibration.js';
export {
  scheduleCalibration,
  recordCalibration,
  trackCertification,
  getCalibrationDue,
} from './services/calibration.js';

// EAM Analytics
export type {
  MTBFMetrics,
  MTTRMetrics,
  MaintenanceCostAnalysis,
  EAMDashboard,
} from './services/eam-analytics.js';
export {
  getMTBF,
  getMTTR,
  analyzeMaintenanceCosts,
  getEAMDashboard,
} from './services/eam-analytics.js';
