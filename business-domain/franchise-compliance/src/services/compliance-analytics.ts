export function calculateComplianceRate(total: number, compliant: number): number {
  return total > 0 ? (compliant / total) * 100 : 0;
}
