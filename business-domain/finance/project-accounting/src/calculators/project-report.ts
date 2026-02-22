import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see PA-03 — Earned value management: EV, PV, AC, CPI, SPI
 * G-09 / PA-08 — Project Profitability Report
 *
 * Generates a comprehensive profitability report for a project,
 * including revenue, costs, margin, and EAC (Estimate at Completion).
 *
 * Pure function — no I/O.
 */

export type ProjectFinancials = {
  projectId: string;
  projectName: string;
  budgetRevenueMinor: number;
  budgetCostMinor: number;
  actualRevenueMinor: number;
  actualCostMinor: number;
  commitmentMinor: number;
  percentComplete: number;
};

export type ProjectProfitabilityReport = {
  projectId: string;
  projectName: string;
  actualMarginMinor: number;
  actualMarginPct: number;
  budgetMarginMinor: number;
  budgetMarginPct: number;
  eacRevenueMinor: number;
  eacCostMinor: number;
  eacMarginMinor: number;
  eacMarginPct: number;
  costVarianceMinor: number;
  revenueVarianceMinor: number;
  cpi: number;
  spi: number;
  status: 'on-track' | 'at-risk' | 'over-budget';
};

/**
 * Compute project profitability with EVM metrics.
 *
 * CPI = EV / AC (Cost Performance Index)
 * SPI = EV / PV (Schedule Performance Index)
 * EAC = BAC / CPI (Estimate at Completion)
 */
export function computeProjectProfitabilityReport(
  financials: ProjectFinancials,
): CalculatorResult<ProjectProfitabilityReport> {
  if (financials.percentComplete < 0 || financials.percentComplete > 100) {
    throw new DomainError('VALIDATION_FAILED', 'Percent complete must be 0-100');
  }

  const actualMarginMinor = financials.actualRevenueMinor - financials.actualCostMinor;
  const actualMarginPct = financials.actualRevenueMinor === 0 ? 0 : round2((actualMarginMinor / financials.actualRevenueMinor) * 100);
  const budgetMarginMinor = financials.budgetRevenueMinor - financials.budgetCostMinor;
  const budgetMarginPct = financials.budgetRevenueMinor === 0 ? 0 : round2((budgetMarginMinor / financials.budgetRevenueMinor) * 100);

  const ev = financials.budgetCostMinor * (financials.percentComplete / 100);
  const pv = financials.budgetCostMinor * (financials.percentComplete / 100);
  const ac = financials.actualCostMinor;

  const cpi = ac === 0 ? 1 : round2(ev / ac);
  const spi = pv === 0 ? 1 : round2(ev / pv);

  const eacCostMinor = cpi === 0 ? financials.budgetCostMinor : Math.round(financials.budgetCostMinor / cpi);
  const eacRevenueMinor = financials.budgetRevenueMinor;
  const eacMarginMinor = eacRevenueMinor - eacCostMinor;
  const eacMarginPct = eacRevenueMinor === 0 ? 0 : round2((eacMarginMinor / eacRevenueMinor) * 100);

  let status: 'on-track' | 'at-risk' | 'over-budget';
  if (cpi >= 0.95) status = 'on-track';
  else if (cpi >= 0.85) status = 'at-risk';
  else status = 'over-budget';

  return {
    result: {
      projectId: financials.projectId,
      projectName: financials.projectName,
      actualMarginMinor,
      actualMarginPct,
      budgetMarginMinor,
      budgetMarginPct,
      eacRevenueMinor,
      eacCostMinor,
      eacMarginMinor,
      eacMarginPct,
      costVarianceMinor: financials.budgetCostMinor * (financials.percentComplete / 100) - financials.actualCostMinor,
      revenueVarianceMinor: financials.actualRevenueMinor - financials.budgetRevenueMinor * (financials.percentComplete / 100),
      cpi,
      spi,
      status,
    },
    inputs: financials,
    explanation: `Project ${financials.projectName}: CPI ${cpi}, status ${status}, EAC margin ${eacMarginPct}%`,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
