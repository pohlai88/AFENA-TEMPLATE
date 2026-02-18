export function detectAnomalies(sales: number[], threshold: number = 2.5): number[] {
  const mean = sales.reduce((a, b) => a + b, 0) / sales.length;
  const stdDev = Math.sqrt(sales.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / sales.length);
  return sales.map((s, i) => Math.abs(s - mean) / stdDev > threshold ? i : -1).filter(i => i >= 0);
}
