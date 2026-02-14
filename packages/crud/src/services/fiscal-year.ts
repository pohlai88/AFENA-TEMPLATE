/**
 * Resolve the current fiscal year for a company.
 *
 * Uses the company's fiscal_year_start month (1-12) to determine
 * which fiscal year a given date falls in.
 *
 * Example: fiscal_year_start = 4 (April)
 * - Jan 2026 → FY 2025 (before April)
 * - Apr 2026 → FY 2026 (April or after)
 */
export function resolveFiscalYear(
  fiscalYearStartMonth: number,
  asOfDate: Date = new Date(),
): number {
  const month = asOfDate.getMonth() + 1; // 1-indexed
  const year = asOfDate.getFullYear();

  if (fiscalYearStartMonth <= 1) return year;
  return month >= fiscalYearStartMonth ? year : year - 1;
}
