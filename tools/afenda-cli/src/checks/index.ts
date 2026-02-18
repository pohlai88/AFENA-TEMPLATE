/**
 * Housekeeping commands - consolidated from eco-hk
 */

export { runInvariants } from './invariants';

export interface HousekeepingResult {
  ok: boolean;
  failures: unknown[];
  summary: {
    failures: number;
    files: number;
  };
}
