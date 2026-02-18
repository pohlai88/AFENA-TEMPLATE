/**
 * Export Analytics Service
 * Provides performance metrics, lead time analysis, and cost analytics
 */

import type { ExportOrder } from './export-declaration';
import type { ExportShipment } from './shipping-coordination';

// ============================================================================
// Analytics Functions
// ============================================================================

export function analyzeExportPerformance(
  exports: ExportOrder[],
  shipments: ExportShipment[]
): {
  totalExports: number;
  totalValue: number;
  avgOrderValue: number;
  topDestinations: Array<{ country: string; count: number; value: number }>;
  onTimeDeliveryRate: number;
  avgTransitTime: number;
  documentCompletionRate: number;
} {
  const totalExports = exports.length;
  const totalValue = exports.reduce((sum, exp) => sum + exp.totalValue, 0);
  const avgOrderValue = totalExports > 0 ? totalValue / totalExports : 0;

  // Top destinations
  const destinationMap = new Map<string, { count: number; value: number }>();
  exports.forEach(exp => {
    if (!destinationMap.has(exp.destinationCountry)) {
      destinationMap.set(exp.destinationCountry, { count: 0, value: 0 });
    }
    const dest = destinationMap.get(exp.destinationCountry)!;
    dest.count++;
    dest.value += exp.totalValue;
  });

  const topDestinations = Array.from(destinationMap.entries())
    .map(([country, data]) => ({ country, ...data }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // On-time delivery
  const deliveredShipments = shipments.filter(s => s.actualArrivalDate);
  const onTimeCount = deliveredShipments.filter(s => 
    s.actualArrivalDate && s.estimatedArrivalDate &&
    s.actualArrivalDate <= s.estimatedArrivalDate
  ).length;
  const onTimeDeliveryRate = deliveredShipments.length > 0 
    ? (onTimeCount / deliveredShipments.length) * 100 
    : 0;

  // Transit time
  let totalTransitDays = 0;
  deliveredShipments.forEach(s => {
    if (s.actualArrivalDate && s.actualDepartureDate) {
      const days = Math.floor(
        (s.actualArrivalDate.getTime() - s.actualDepartureDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      totalTransitDays += days;
    }
  });
  const avgTransitTime = deliveredShipments.length > 0 ? totalTransitDays / deliveredShipments.length : 0;

  // Document completion
  const completedDocs = exports.filter(exp => 
    exp.completedDocuments.length === exp.requiredDocuments.length
  ).length;
  const documentCompletionRate = totalExports > 0 ? (completedDocs / totalExports) * 100 : 0;

  return {
    totalExports,
    totalValue: Math.round(totalValue),
    avgOrderValue: Math.round(avgOrderValue),
    topDestinations,
    onTimeDeliveryRate: Math.round(onTimeDeliveryRate),
    avgTransitTime: Math.round(avgTransitTime * 10) / 10,
    documentCompletionRate: Math.round(documentCompletionRate),
  };
}
