/**
 * @afenda-hr-core
 * 
 * Employee master data and organizational structure management.
 */

export {
  hireEmployee,
  transferEmployee,
  terminateEmployee,
  getEmployee,
  listEmployees,
  type HireEmployeeInput,
  type TransferEmployeeInput,
  type TerminateEmployeeInput,
  type Employee,
} from './services/employee-management.js';

export {
  defineOrgHierarchy,
  assignManager,
  defineJobPosition,
  getDepartmentHierarchy,
  getReportingChain,
  calculateSpanOfControl,
  type DefineOrgHierarchyInput,
  type AssignManagerInput,
  type DefineJobPositionInput,
  type Department,
  type Position,
  type OrgHierarchy,
} from './services/organizational-structure.js';

export {
  updateEmployeeInfo,
  trackEmployeeHistory,
  manageEmployeeDocument,
  getEmployeeDocuments,
  getExpiringDocuments,
  getEmployeeProfile,
  type UpdateEmployeeInfoInput,
  type ManageEmployeeDocumentInput,
  type EmploymentHistory,
  type EmployeeDocument,
} from './services/employee-data.js';

export {
  defineCompetencyModel,
  assessEmployeeSkills,
  identifySkillGaps,
  getEmployeeSkillMatrix,
  getCompetencyModel,
  getSkillInventory,
  type DefineCompetencyModelInput,
  type AssessEmployeeSkillsInput,
  type IdentifySkillGapsInput,
  type Competency,
  type CompetencyModel,
  type SkillAssessment,
  type SkillGap,
} from './services/competency-skills.js';

export {
  analyzeHeadcount,
  trackTurnover,
  forecastWorkforce,
  getWorkforceDemographics,
  getHiringPipelineMetrics,
  identifyFlightRisk,
  type AnalyzeHeadcountInput,
  type TrackTurnoverInput,
  type ForecastWorkforceInput,
  type HeadcountAnalysis,
  type TurnoverMetrics,
  type WorkforceForecast,
} from './services/workforce-analytics.js';
