export function calculateCampaignROI(spent: number, salesIncrease: number): number {
  return spent > 0 ? ((salesIncrease - spent) / spent) * 100 : 0;
}
