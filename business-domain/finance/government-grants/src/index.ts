/**
 * Government Grants — IAS 20
 */

/** @see FIN-GG-REC-01 — Government grant queries (IAS 20) */
export { getGrant, listActiveGrants } from './queries/grant-query';
export type { GrantReadModel } from './queries/grant-query';

export { computeGrantAmortisation } from './calculators/grant-calc';
export type { GrantAmortisationResult } from './calculators/grant-calc';

export { buildGrantAmortiseIntent, buildGrantRecogniseIntent } from './commands/grant-intent';

/** @see FIN-GG-REC-01 — Government grant service: recognise + amortise (IAS 20) */
export { amortiseGrant, recogniseGrant } from './services/grant-service';
