export function calculateYield(royalties: number[], sales: number[]): number {
  const totalRoyalties = royalties.reduce((a, b) => a + b, 0);
  const totalSales = sales.reduce((a, b) => a + b, 0);
  return totalSales > 0 ? (totalRoyalties / totalSales) * 100 : 0;
}
