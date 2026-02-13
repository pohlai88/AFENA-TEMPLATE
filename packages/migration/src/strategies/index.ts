export {
  ContactsConflictDetector,
  InvoicesConflictDetector,
  ProductsConflictDetector,
  NoConflictDetector,
  CONFLICT_DETECTOR_REGISTRY,
  getConflictDetector,
} from './conflict-detector.js';
export type { ConflictDetector, Conflict, DetectorContext } from './conflict-detector.js';
