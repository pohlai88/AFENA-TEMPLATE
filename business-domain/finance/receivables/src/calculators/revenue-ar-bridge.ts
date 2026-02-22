import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * AR-10 — Revenue Recognition ↔ AR Integration (IFRS 15)
 *
 * Reconciles revenue recognized (IFRS 15) against AR invoiced amounts.
 * Identifies contract assets (revenue > invoiced) and contract liabilities
 * (invoiced > revenue). Per IFRS 15 §105.
 *
 * Pure function — no I/O.
 */

export type ContractRevenueData = {
  contractId: string;
  customerId: string;
  revenueRecognizedMinor: number;
  invoicedMinor: number;
  cashReceivedMinor: number;
};

export type ContractBalanceClassification = {
  contractId: string;
  customerId: string;
  revenueRecognizedMinor: number;
  invoicedMinor: number;
  contractAssetMinor: number;
  contractLiabilityMinor: number;
  tradeReceivableMinor: number;
};

export type RevenueBridgeResult = {
  contracts: ContractBalanceClassification[];
  totalContractAssetsMinor: number;
  totalContractLiabilitiesMinor: number;
  totalTradeReceivablesMinor: number;
};

export function classifyContractBalances(
  contracts: ContractRevenueData[],
): CalculatorResult<RevenueBridgeResult> {
  if (contracts.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'No contracts provided');
  }

  const classified: ContractBalanceClassification[] = contracts.map((c) => {
    const netPosition = c.revenueRecognizedMinor - c.invoicedMinor;
    return {
      contractId: c.contractId,
      customerId: c.customerId,
      revenueRecognizedMinor: c.revenueRecognizedMinor,
      invoicedMinor: c.invoicedMinor,
      contractAssetMinor: Math.max(0, netPosition),
      contractLiabilityMinor: Math.max(0, -netPosition),
      tradeReceivableMinor: Math.max(0, c.invoicedMinor - c.cashReceivedMinor),
    };
  });

  const totalContractAssetsMinor = classified.reduce((s, c) => s + c.contractAssetMinor, 0);
  const totalContractLiabilitiesMinor = classified.reduce((s, c) => s + c.contractLiabilityMinor, 0);
  const totalTradeReceivablesMinor = classified.reduce((s, c) => s + c.tradeReceivableMinor, 0);

  return {
    result: { contracts: classified, totalContractAssetsMinor, totalContractLiabilitiesMinor, totalTradeReceivablesMinor },
    inputs: { contractCount: contracts.length },
    explanation: `Revenue bridge: ${contracts.length} contracts, assets=${totalContractAssetsMinor}, liabilities=${totalContractLiabilitiesMinor}, receivables=${totalTradeReceivablesMinor}`,
  };
}
