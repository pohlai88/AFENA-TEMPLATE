/**
 * IAS 2.36 — Inventory Disclosure Computation
 *
 * Computes the disclosure amounts required by IAS 2.36:
 * carrying amounts by category, write-downs, and reversals.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type InventoryCategory = {
  category: string;
  costMinor: number;
  carryingMinor: number;
  writeDownMinor: number;
};

export type InventoryDisclosureInput = {
  categories: InventoryCategory[];
  cogsMinor: number;
  writeDownsThisPeriodMinor: number;
  reversalsThisPeriodMinor: number;
};

export type InventoryDisclosureResult = {
  totalCostMinor: number;
  totalCarryingMinor: number;
  totalWriteDownMinor: number;
  cogsMinor: number;
  netWriteDownMovementMinor: number;
  explanation: string;
};

export function computeInventoryDisclosure(
  inputs: InventoryDisclosureInput,
): CalculatorResult<InventoryDisclosureResult> {
  const { categories, cogsMinor, writeDownsThisPeriodMinor, reversalsThisPeriodMinor } = inputs;

  if (categories.length === 0) throw new DomainError('VALIDATION_FAILED', 'At least one category required');

  const totalCostMinor = categories.reduce((s, c) => s + c.costMinor, 0);
  const totalCarryingMinor = categories.reduce((s, c) => s + c.carryingMinor, 0);
  const totalWriteDownMinor = categories.reduce((s, c) => s + c.writeDownMinor, 0);
  const netWriteDownMovementMinor = writeDownsThisPeriodMinor - reversalsThisPeriodMinor;

  const explanation =
    `Inventory disclosure (IAS 2.36): cost ${totalCostMinor}, carrying ${totalCarryingMinor}, ` +
    `write-downs ${totalWriteDownMinor}, COGS ${cogsMinor}, net movement ${netWriteDownMovementMinor}`;

  return {
    result: { totalCostMinor, totalCarryingMinor, totalWriteDownMinor, cogsMinor, netWriteDownMovementMinor, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
