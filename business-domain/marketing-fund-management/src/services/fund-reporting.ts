export function generateQuarterlyReport(collections: number[], spend: number[]): {
  totalIn: number;
  totalOut: number;
  balance: number;
} {
  const totalIn = collections.reduce((a, b) => a + b, 0);
  const totalOut = spend.reduce((a, b) => a + b, 0);
  return { totalIn, totalOut, balance: totalIn - totalOut };
}
