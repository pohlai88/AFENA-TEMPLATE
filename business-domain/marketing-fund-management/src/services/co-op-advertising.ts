export function calculateCoopMatch(unitSpend: number, matchRate: number): number {
  return unitSpend * (matchRate / 100);
}
