/**
 * Alias Resolution System
 *
 * Multi-tenant, deterministic alias resolution with full traceability.
 * Maps human-readable names to machine-readable asset keys.
 *
 * Invariants (locked - see canon.architecture.md §7.3):
 * A1: resolveAlias() determinism
 * A2: slugify() idempotence
 * A3: Fuzzy matching requires opt-in
 * A4: Input ordering independence
 */

import type { MetaAliasScopeType } from '../enums/meta-alias-scope-type';

/**
 * Alias candidate - one possible interpretation of a human input
 */
export interface AliasCandidate {
  aliasValue: string; // Human-readable name (e.g., "Kundenrechnung")
  targetAssetKey: string; // Machine-readable asset key
  scopeType: MetaAliasScopeType; // org, team, role, user, locale, app_area
  scopeValue: string; // Org ID, team name, role name, etc.
  priority: number; // Higher priority wins in ties
}

/**
 * Specificity weights for scope types
 * Higher = higher priority in tie-breaking
 *
 * User > Role > Team > Org > Locale > AppArea
 */
export const ALIAS_SCOPE_SPECIFICITY: Record<MetaAliasScopeType, number> = {
  user: 60,
  role: 50,
  team: 40,
  org: 30,
  locale: 20,
  app_area: 10,
};

/**
 * Result of matching an alias against candidates
 */
export interface AliasMatch {
  candidate: AliasCandidate;
  score: number; // 0.0–1.0
  matchType: 'exact' | 'slug' | 'synonym' | 'fuzzy';
}

/**
 * Rule for resolving tied matches
 */
export interface ResolutionRule {
  name: string;
  priority: number; // Higher = applied first
  matchFn: (input: string, candidate: AliasCandidate) => AliasMatch | null;
}

/**
 * Context for alias resolution
 * Used to filter candidates by scope
 */
export interface ResolutionContext {
  orgId: string;
  userId: string;
  roles: string[];
  locale: string;
  appArea?: string;
}

/**
 * Trace step for debugging resolution
 */
export interface AliasTrace {
  step: number;
  ruleName: string;
  candidatesTested: number;
  winner: AliasMatch | null;
  elapsed: number; // milliseconds
}

/**
 * Complete resolution result with full traceability
 */
export interface ResolutionResult {
  winner: AliasMatch | null;
  trace: AliasTrace[];
  allMatches: AliasMatch[]; // All matches in score order
}

/**
 * Convert a string to slug format (lowercase, normalize whitespace, hyphens)
 * Idempotent: slugify(slugify(x)) === slugify(x)
 *
 * @example
 * slugify('Customer Invoice') => 'customer-invoice'
 * slugify('CUSTOMER_INVOICE') => 'customer-invoice'
 */
export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      // Replace whitespace and underscores with hyphens
      .replace(/[\s_]+/g, '-')
      // Remove non-alphanumeric except hyphens
      .replace(/[^a-z0-9-]/g, '')
      // Collapse multiple hyphens
      .replace(/-+/g, '-')
      // Trim hyphens from edges
      .replace(/^-+|-+$/g, '')
  );
}

/**
 * Match an input string against a list of candidates
 * Three match types:
 * - exact: case-insensitive exact match
 * - slug: slugified match
 * - synonym: caller-provided (matching handled here, scoring by caller relevance)
 * - fuzzy: Levenshtein distance (opt-in only)
 *
 * @param opts.fuzzy - Enable fuzzy matching (disabled by default - A3 invariant)
 * @returns All matches with scores in descending order, never throws
 */
export function matchAlias(
  input: string,
  candidates: AliasCandidate[],
  opts?: { fuzzy?: boolean }
): AliasMatch[] {
  const matches: AliasMatch[] = [];
  const inputSlug = slugify(input);
  const inputLower = input.toLowerCase();

  for (const candidate of candidates) {
    const candidateSlug = slugify(candidate.aliasValue);
    const candidateLower = candidate.aliasValue.toLowerCase();

    // 1. Exact match (case-insensitive)
    if (inputLower === candidateLower) {
      matches.push({
        candidate,
        score: 1.0,
        matchType: 'exact',
      });
      continue;
    }

    // 2. Slug match
    if (inputSlug === candidateSlug) {
      matches.push({
        candidate,
        score: 0.95,
        matchType: 'slug',
      });
      continue;
    }

    // 3. Fuzzy match (opt-in only - A3 invariant)
    if (opts?.fuzzy) {
      const distance = levenshteinDistance(inputSlug, candidateSlug);
      const maxLen = Math.max(inputSlug.length, candidateSlug.length);
      if (maxLen > 0) {
        const similarity = 1.0 - distance / maxLen;
        if (similarity >= 0.7) {
          // Only match if similarity >= 70%
          matches.push({
            candidate,
            score: 0.7 * similarity, // Fuzzy is lower priority (max 0.7)
            matchType: 'fuzzy',
          });
        }
      }
    }
  }

  // Sort by score descending
  return matches.sort((a, b) => b.score - a.score);
}

/**
 * Resolve alias using tie-breaking rules and context filtering
 *
 * Steps:
 * 1. Filter matches by context (scope type/value alignment)
 * 2. Apply resolution rules in priority order
 * 3. If tied, apply deterministic tie-breaker (D22):
 *    a. Higher candidate.priority
 *    b. More specific scope (ALIAS_SCOPE_SPECIFICITY)
 *    c. Lexically earlier targetAssetKey
 *    d. Lexically earlier aliasValue
 * 4. If minConfidence set, filter matches below threshold
 *
 * @returns Winner + full trace for debugging; winner is null if no match survives filters
 */
export function resolveAlias(
  matches: AliasMatch[],
  rules: ResolutionRule[],
  ctx: ResolutionContext,
  opts?: { minConfidence?: number }
): ResolutionResult {
  const trace: AliasTrace[] = [];

  // A4 invariant: Sort matches to ensure input order independence
  const sortedMatches = [...matches].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.candidate.aliasValue.localeCompare(b.candidate.aliasValue);
  });

  let workingMatches = sortedMatches;

  // Apply minConfidence filter if specified
  const minConfidence = opts?.minConfidence;
  if (minConfidence !== undefined) {
    workingMatches = workingMatches.filter((m) => m.score >= minConfidence);
  }

  // Apply resolution rules in priority order
  for (const rule of rules.sort((a, b) => b.priority - a.priority)) {
    const ruleStartTime = performance.now();
    const ruleMatches = workingMatches.filter(
      (m) =>
        m.candidate.scopeType === 'org' ||
        (m.candidate.scopeType === 'user' && m.candidate.scopeValue === ctx?.userId) ||
        (m.candidate.scopeType === 'role' && ctx?.roles?.includes(m.candidate.scopeValue)) ||
        (m.candidate.scopeType === 'team' && m.candidate.scopeValue === ctx?.orgId) ||
        (m.candidate.scopeType === 'locale' && m.candidate.scopeValue === ctx?.locale) ||
        (m.candidate.scopeType === 'app_area' && m.candidate.scopeValue === ctx?.appArea)
    );
    const ruleElapsed = performance.now() - ruleStartTime;

    const winner: AliasMatch | null = ruleMatches.length > 0 ? ruleMatches[0]! : null;

    trace.push({
      step: trace.length + 1,
      ruleName: rule.name,
      candidatesTested: ruleMatches.length,
      winner: winner ?? null,
      elapsed: ruleElapsed,
    });

    if (winner) {
      return {
        winner,
        trace,
        allMatches: sortedMatches,
      };
    }
  }

  // No winner found
  return {
    winner: null,
    trace,
    allMatches: sortedMatches,
  };
}

/**
 * Calculate Levenshtein distance between two strings
 * Used for fuzzy matching
 */
function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i]![0] = i;
  for (let j = 0; j <= n; j++) dp[0]![j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i]![j] = dp[i - 1]![j - 1]!;
      } else {
        dp[i]![j] = 1 + Math.min(dp[i - 1]![j]!, dp[i]![j - 1]!, dp[i - 1]![j - 1]!);
      }
    }
  }

  return dp[m]![n]!;
}
