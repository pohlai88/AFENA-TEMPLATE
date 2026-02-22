/**
 * afenda-canon/domain/hr — Human Resources domain intent payloads & ports.
 *
 * TODO: 10 packages planned — hr-core, payroll, time-attendance, recruitment,
 * performance, learning, compensation, compliance-hr, org-chart, employee-portal.
 *
 * When implementing:
 * 1. Define payload types in ../types/domain-intent.ts
 * 2. Re-export them here (grouped by sub-domain)
 * 3. Add port interfaces for cross-cutting reads
 * 4. Run: pnpm --filter "./business-domain/hr/**" exec tsc --noEmit
 */

// ── Re-export shared types for convenience ──────────────────
export type { DomainContext } from '../types/domain-context';
export type { DomainResult } from '../types/domain-result';
export type { DomainIntent } from '../types/domain-intent';
export type { CalculatorResult } from '../types/calculator-result';
export { DomainError } from '../types/domain-error';
export { stableCanonicalJson } from '../utils/stable-json';

// ── HR Intent Payloads ──────────────────────────────────────
// TODO: Add payload types as HR packages are implemented
// Example:
//   export type { PayrollRunPayload } from '../types/domain-intent';
//   export type { LeaveApprovePayload } from '../types/domain-intent';

// ── Port Interfaces ─────────────────────────────────────────
// TODO: Add HR-specific ports as needed
// Example:
//   export type { EmployeePort, PayrollPort } from '../ports/index';
