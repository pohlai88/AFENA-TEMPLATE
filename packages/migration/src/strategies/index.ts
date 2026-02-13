export {
  ContactsConflictDetector,
  InvoicesConflictDetector,
  ProductsConflictDetector,
  NoConflictDetector,
  CONFLICT_DETECTOR_REGISTRY,
  getConflictDetector,
} from './conflict-detector.js';
export type { ConflictDetector, Conflict, DetectorContext, DetectorQueryFn } from './conflict-detector.js';
export { fuzzyMatchName, batchFuzzyMatchNames } from './fuzzy-name-matcher.js';
export type { FuzzyMatchConfig, FuzzyMatchResult } from './fuzzy-name-matcher.js';
