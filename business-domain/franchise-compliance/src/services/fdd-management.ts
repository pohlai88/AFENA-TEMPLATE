export function createFDDVersion(changes: string[]): { version: number; effectiveDate: Date } {
  return { version: 1, effectiveDate: new Date() };
}
