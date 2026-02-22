/**
 * Canon Contract Gate
 *
 * Ensures the canon contract surface remains stable for finance consumers.
 * If this file fails to compile or any assertion breaks, canon changed
 * in a way that will break downstream finance packages.
 *
 * Run: pnpm --filter ci-gates test -- canon-contract
 */
import { describe, expect, expectTypeOf, it } from 'vitest';

import type {
  CalculatorResult,
  CloseAdjustmentPostPayload,
  CompanyId,
  CreditLimitUpdatePayload,
  FiscalPeriodKey,
  LedgerId,
  SiteId,
} from 'afenda-canon';
import {
  CompanyIdSchema,
  FiscalPeriodKeySchema,
  LedgerIdSchema,
  SiteIdSchema,
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
} from 'afenda-canon';

// ── Type-level contract assertions ──────────────────────────────────
// These fail at compile time if canon removes or renames fields.

describe('Canon contract — type-level', () => {
  it('CreditLimitUpdatePayload has required fields', () => {
    expectTypeOf<CreditLimitUpdatePayload>().toHaveProperty('customerId' as const);
    expectTypeOf<CreditLimitUpdatePayload>().toHaveProperty('newLimitMinor' as const);
    expectTypeOf<CreditLimitUpdatePayload>().toHaveProperty('effectiveAt' as const);
    expectTypeOf<CreditLimitUpdatePayload>().toHaveProperty('currency' as const);
    expectTypeOf<CreditLimitUpdatePayload>().toHaveProperty('reason' as const);
    expectTypeOf<CreditLimitUpdatePayload>().toHaveProperty('approvedBy' as const);
  });

  it('CloseAdjustmentPostPayload has required fields', () => {
    expectTypeOf<CloseAdjustmentPostPayload>().toHaveProperty('closeRunId' as const);
    expectTypeOf<CloseAdjustmentPostPayload>().toHaveProperty('journalId' as const);
    expectTypeOf<CloseAdjustmentPostPayload>().toHaveProperty('effectiveAt' as const);
    expectTypeOf<CloseAdjustmentPostPayload>().toHaveProperty('adjustmentType' as const);
  });

  it('CalculatorResult generic is available', () => {
    expectTypeOf<CalculatorResult<number>>().toHaveProperty('result' as const);
    expectTypeOf<CalculatorResult<number>>().toHaveProperty('inputs' as const);
    expectTypeOf<CalculatorResult<number>>().toHaveProperty('explanation' as const);
  });

  it('Branded types are structurally distinct from plain string', () => {
    // Branded types extend string but are not assignable from string
    expectTypeOf<string>().not.toMatchTypeOf<CompanyId>();
    expectTypeOf<string>().not.toMatchTypeOf<LedgerId>();
    expectTypeOf<string>().not.toMatchTypeOf<FiscalPeriodKey>();
    expectTypeOf<string>().not.toMatchTypeOf<SiteId>();
  });
});

// ── Runtime invariant assertions ────────────────────────────────────
// These test actual validation behaviour, not just "any string passes".

describe('Canon contract — is*() type guards', () => {
  it('isCompanyId rejects empty string', () => {
    expect(isCompanyId('')).toBe(false);
  });

  it('isCompanyId accepts non-empty string', () => {
    expect(isCompanyId('X')).toBe(true);
  });

  it('isCompanyId rejects non-string', () => {
    expect(isCompanyId(42)).toBe(false);
    expect(isCompanyId(null)).toBe(false);
  });

  it('isLedgerId rejects empty, accepts non-empty', () => {
    expect(isLedgerId('')).toBe(false);
    expect(isLedgerId('ledger-1')).toBe(true);
  });

  it('isSiteId rejects empty, accepts non-empty', () => {
    expect(isSiteId('')).toBe(false);
    expect(isSiteId('site-1')).toBe(true);
  });

  it('isFiscalPeriodKey validates against schema regex', () => {
    // Validate test samples against the schema to avoid brittle hardcoding
    expect(FiscalPeriodKeySchema.safeParse('2025-03').success).toBe(true);
    expect(FiscalPeriodKeySchema.safeParse('2025-P03').success).toBe(true);
    expect(FiscalPeriodKeySchema.safeParse('bad').success).toBe(false);
    expect(FiscalPeriodKeySchema.safeParse('2025-00').success).toBe(false);
    expect(FiscalPeriodKeySchema.safeParse('2025-13').success).toBe(false);

    // Guard matches schema behaviour
    expect(isFiscalPeriodKey('2025-03')).toBe(true);
    expect(isFiscalPeriodKey('2025-P03')).toBe(true);
    expect(isFiscalPeriodKey('bad')).toBe(false);
    expect(isFiscalPeriodKey('2025-00')).toBe(false);
    expect(isFiscalPeriodKey('2025-13')).toBe(false);
  });
});

describe('Canon contract — as*() fast coercion', () => {
  it('asCompanyId rejects empty string', () => {
    expect(() => asCompanyId('')).toThrow();
  });

  it('asCompanyId accepts non-empty string', () => {
    expect(asCompanyId('X')).toBe('X');
  });

  it('asLedgerId rejects empty, accepts non-empty', () => {
    expect(() => asLedgerId('')).toThrow();
    expect(asLedgerId('ledger-1')).toBe('ledger-1');
  });

  it('asSiteId rejects empty, accepts non-empty', () => {
    expect(() => asSiteId('')).toThrow();
    expect(asSiteId('site-1')).toBe('site-1');
  });

  it('asFiscalPeriodKey rejects invalid format', () => {
    expect(() => asFiscalPeriodKey('bad')).toThrow();
    expect(() => asFiscalPeriodKey('2025-00')).toThrow();
  });

  it('asFiscalPeriodKey accepts valid format', () => {
    expect(asFiscalPeriodKey('2025-03')).toBe('2025-03');
    expect(asFiscalPeriodKey('2025-P03')).toBe('2025-P03');
  });

  it('as*() throws CanonValidationError with INVALID_BRANDED code', () => {
    try {
      asCompanyId('');
    } catch (e: unknown) {
      const err = e as { name: string; code: string; field: string };
      expect(err.name).toBe('CanonValidationError');
      expect(err.code).toBe('INVALID_BRANDED');
      expect(err.field).toBe('CompanyId');
      return;
    }
    expect.unreachable('should have thrown');
  });
});

describe('Canon contract — parse*() full Zod validation', () => {
  it('parseCompanyId rejects empty string', () => {
    expect(() => parseCompanyId('')).toThrow();
  });

  it('parseCompanyId accepts non-empty string', () => {
    expect(parseCompanyId('company-1')).toBe('company-1');
  });

  it('parseLedgerId rejects empty, accepts non-empty', () => {
    expect(() => parseLedgerId('')).toThrow();
    expect(parseLedgerId('ledger-1')).toBe('ledger-1');
  });

  it('parseSiteId rejects empty, accepts non-empty', () => {
    expect(() => parseSiteId('')).toThrow();
    expect(parseSiteId('site-1')).toBe('site-1');
  });

  it('parseFiscalPeriodKey rejects invalid, accepts valid', () => {
    expect(() => parseFiscalPeriodKey('bad')).toThrow();
    expect(parseFiscalPeriodKey('2025-03')).toBe('2025-03');
  });
});

// ── Schema export assertions ────────────────────────────────────────
// Ensure schemas are still exported (used by parse*() and external consumers).

describe('Canon contract — schema exports', () => {
  it('CompanyIdSchema is exported and functional', () => {
    expect(CompanyIdSchema.safeParse('x').success).toBe(true);
    expect(CompanyIdSchema.safeParse('').success).toBe(false);
  });

  it('LedgerIdSchema is exported and functional', () => {
    expect(LedgerIdSchema.safeParse('x').success).toBe(true);
    expect(LedgerIdSchema.safeParse('').success).toBe(false);
  });

  it('SiteIdSchema is exported and functional', () => {
    expect(SiteIdSchema.safeParse('x').success).toBe(true);
    expect(SiteIdSchema.safeParse('').success).toBe(false);
  });

  it('FiscalPeriodKeySchema is exported and functional', () => {
    expect(FiscalPeriodKeySchema.safeParse('2025-03').success).toBe(true);
    expect(FiscalPeriodKeySchema.safeParse('bad').success).toBe(false);
  });
});
