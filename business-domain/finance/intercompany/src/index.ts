/**
 * @see FIN-IC-MIRROR-01 — IC transactions mirrored with shared references and auto-balancing
 */

export { matchIcTransactions } from './calculators/ic-matching';
export type { IcMatchPair, IcTransaction } from './calculators/ic-matching';

export { createAndMirrorIc, reconcileFromDb, reconcileIntercompany } from './services/ic-service';
export type { IcReconciliationResult } from './services/ic-service';

