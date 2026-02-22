/**
 * afenda-canon/domain — Shared domain exports for ALL business-domain packages.
 *
 * This barrel contains types and utilities that every domain family needs:
 * - DomainContext, DomainResult, DomainError
 * - Branded types + helpers (OrgId, CompanyId, LedgerId, etc.)
 * - CalculatorResult
 * - stableCanonicalJson
 * - DomainIntent (the full union — individual families re-export their subset)
 *
 * Family-specific intent payloads and ports live in their own sub-modules:
 *   import type { JournalPostPayload } from 'afenda-canon/domain/finance';
 *   import type { PayrollRunPayload } from 'afenda-canon/domain/hr';
 *
 * ADDING A NEW DOMAIN FAMILY:
 * 1. Create domain/<family>.ts with payload types + ports
 * 2. Add sub-path export in package.json: "./domain/<family>"
 * 3. Add entry in tsup.config.ts
 * 4. Add typesVersions entry in package.json
 * 5. Update this header comment
 */

// ── Context & Result ────────────────────────────────────────
export type { DomainContext } from '../types/domain-context';
export type { DomainResult } from '../types/domain-result';
export type { CalculatorResult } from '../types/calculator-result';

// ── Errors ──────────────────────────────────────────────────
export { DomainError } from '../types/domain-error';
export type { DomainErrorCode } from '../types/domain-error';
export { CanonValidationError, ERROR_CODES } from '../types/errors';

// ── Branded Types + Helpers ─────────────────────────────────
export {
  asCompanyId,
  asFiscalPeriodKey,
  asLedgerId,
  asSiteId,
  isCompanyId,
  isFiscalPeriodKey,
  isLedgerId,
  isSiteId,
  parseCompanyId,
  parseFiscalPeriodKey,
  parseLedgerId,
  parseSiteId,
} from '../types/branded';
export type {
  Brand,
  CompanyId,
  CurrencyCode,
  FiscalPeriodKey,
  IndustryOverlayKey,
  IsoDateTime,
  LedgerId,
  RoleKey,
  SiteId,
} from '../types/branded';

// ── Core IDs ────────────────────────────────────────────────
export {
  asOrgId,
  asUserId,
  isOrgId,
  isUserId,
} from '../types/ids';
export type { OrgId, UserId } from '../types/ids';

// ── Domain Intent (full union) ──────────────────────────────
export type { DomainIntent, IntentType } from '../types/domain-intent';

// ── Domain Events ───────────────────────────────────────────
export type { AccountingEvent, DomainEvent } from '../types/domain-event';

// ── Utilities ───────────────────────────────────────────────
export { stableCanonicalJson } from '../utils/stable-json';
