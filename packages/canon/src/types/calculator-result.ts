/**
 * Auditable calculator envelope (SK-10).
 *
 * Every domain calculator returns this shape so that the command/service
 * layer can persist an audit trail of *what went in* and *why* the
 * calculator produced the result it did.
 *
 * @typeParam T — the domain-specific result type (e.g. `DepreciationResult`)
 */
export type CalculatorResult<T> = {
  /** The computed domain value. */
  result: T;
  /** Snapshot of the arguments that were passed in (for audit replay). */
  inputs: Record<string, unknown>;
  /** Human-readable one-liner explaining the outcome. */
  explanation: string;
};
