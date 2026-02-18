export function calculateMarketingFee(sales: number, feeRate: number): number {
  return sales * (feeRate / 100);
}
