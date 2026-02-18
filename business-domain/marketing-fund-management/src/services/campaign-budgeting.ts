export function allocateBudget(totalFund: number, campaigns: { type: string; priority: number }[]): Map<string, number> {
  const allocations = new Map<string, number>();
  campaigns.forEach(c => allocations.set(c.type, totalFund / campaigns.length));
  return allocations;
}
