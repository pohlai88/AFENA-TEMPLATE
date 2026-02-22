/**
 * IAS 2.29-33 — Inventory Write-Down
 *
 * Inventories shall be written down to NRV on an item-by-item basis,
 * or by groups of similar items. Reversals are permitted when NRV increases.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type InventoryWriteDownInput = {
  itemId: string;
  costMinor: number;
  nrvMinor: number;
  priorWriteDownMinor: number;
};

export type InventoryWriteDownResult = {
  writeDownMinor: number;
  reversalMinor: number;
  netAdjustmentMinor: number;
  carryingAmountMinor: number;
  explanation: string;
};

export function computeInventoryWriteDown(
  inputs: InventoryWriteDownInput,
): CalculatorResult<InventoryWriteDownResult> {
  const { costMinor, nrvMinor, priorWriteDownMinor } = inputs;

  if (costMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Cost cannot be negative');
  if (nrvMinor < 0) throw new DomainError('VALIDATION_FAILED', 'NRV cannot be negative');

  const requiredWriteDown = Math.max(0, costMinor - nrvMinor);
  const netAdjustmentMinor = requiredWriteDown - priorWriteDownMinor;

  const writeDownMinor = netAdjustmentMinor > 0 ? netAdjustmentMinor : 0;
  const reversalMinor = netAdjustmentMinor < 0 ? Math.abs(netAdjustmentMinor) : 0;
  const carryingAmountMinor = costMinor - requiredWriteDown;

  const explanation = netAdjustmentMinor > 0
    ? `Write-down ${writeDownMinor} (IAS 2.29): cost ${costMinor} > NRV ${nrvMinor}, carrying ${carryingAmountMinor}`
    : netAdjustmentMinor < 0
      ? `Reversal ${reversalMinor} (IAS 2.33): NRV increased, carrying ${carryingAmountMinor}`
      : `No adjustment needed: cost ${costMinor}, NRV ${nrvMinor}, carrying ${carryingAmountMinor}`;

  return {
    result: { writeDownMinor, reversalMinor, netAdjustmentMinor, carryingAmountMinor, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
