export function detectEncroachment(unit1: { lat: number; lng: number }, unit2: { lat: number; lng: number }, minDistance: number): boolean {
  const distance = 10; // TODO: Calculate actual distance
  return distance < minDistance;
}
