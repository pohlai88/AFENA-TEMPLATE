import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { bankMatchingRules } from 'afenda-database';
import { and, asc, eq } from 'drizzle-orm';

// ── Read Models ─────────────────────────────────────────────

export type MatchingRuleReadModel = {
  ruleId: string;
  bankAccountId: string | null;
  ruleName: string;
  priority: number;
  matchField: string;
  matchOperator: string;
  matchPattern: string;
  toleranceMinor: number;
  toleranceDays: number;
  autoMatch: boolean;
  isActive: boolean;
};

// ── Queries ─────────────────────────────────────────────────

/**
 * Load active matching rules for a bank account, ordered by priority.
 * Rules with null bankAccountId are global (apply to all accounts).
 *
 * @see BR-02 — Auto-matching rules (amount, date, reference)
 */
export async function getMatchingRulesForAccount(
  db: DbSession,
  ctx: DomainContext,
  input: { bankAccountId: string },
): Promise<MatchingRuleReadModel[]> {
  const rows = await db.read((tx) =>
    tx
      .select({
        ruleId: bankMatchingRules.id,
        bankAccountId: bankMatchingRules.bankAccountId,
        ruleName: bankMatchingRules.ruleName,
        priority: bankMatchingRules.priority,
        matchField: bankMatchingRules.matchField,
        matchOperator: bankMatchingRules.matchOperator,
        matchPattern: bankMatchingRules.matchPattern,
        toleranceMinor: bankMatchingRules.toleranceMinor,
        toleranceDays: bankMatchingRules.toleranceDays,
        autoMatch: bankMatchingRules.autoMatch,
        isActive: bankMatchingRules.isActive,
      })
      .from(bankMatchingRules)
      .where(
        and(
          eq(bankMatchingRules.orgId, ctx.orgId),
          eq(bankMatchingRules.isActive, true),
          eq(bankMatchingRules.isDeleted, false),
        ),
      )
      .orderBy(asc(bankMatchingRules.priority)),
  );

  // Filter to rules that apply globally (null bankAccountId) or to this specific account
  return rows
    .filter((r) => r.bankAccountId === null || r.bankAccountId === input.bankAccountId)
    .map((r) => ({
      ...r,
      toleranceMinor: Number(r.toleranceMinor),
    }));
}

/**
 * Load all matching rules for the org (admin view).
 */
export async function getAllMatchingRules(
  db: DbSession,
  ctx: DomainContext,
): Promise<MatchingRuleReadModel[]> {
  const rows = await db.read((tx) =>
    tx
      .select({
        ruleId: bankMatchingRules.id,
        bankAccountId: bankMatchingRules.bankAccountId,
        ruleName: bankMatchingRules.ruleName,
        priority: bankMatchingRules.priority,
        matchField: bankMatchingRules.matchField,
        matchOperator: bankMatchingRules.matchOperator,
        matchPattern: bankMatchingRules.matchPattern,
        toleranceMinor: bankMatchingRules.toleranceMinor,
        toleranceDays: bankMatchingRules.toleranceDays,
        autoMatch: bankMatchingRules.autoMatch,
        isActive: bankMatchingRules.isActive,
      })
      .from(bankMatchingRules)
      .where(and(eq(bankMatchingRules.orgId, ctx.orgId), eq(bankMatchingRules.isDeleted, false)))
      .orderBy(asc(bankMatchingRules.priority)),
  );

  return rows.map((r) => ({
    ...r,
    toleranceMinor: Number(r.toleranceMinor),
  }));
}
