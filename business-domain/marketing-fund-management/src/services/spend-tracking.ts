export function trackSpend(budget: number, actual: number): { remaining: number; percentUsed: number } {
  return { remaining: budget - actual, percentUsed: (actual / budget) * 100 };
}
