export function identifyExpiringTerms(units: { termEndDate: Date }[], monthsAhead: number): any[] {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() + monthsAhead);
  return units.filter(u => u.termEndDate <= cutoff);
}
