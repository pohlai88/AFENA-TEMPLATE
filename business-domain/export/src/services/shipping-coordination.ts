/**
 * Shipping Coordination Service
 * Manages shipment booking, freight forwarder coordination, and shipping costs
 */

import type { ExportOrder } from './export-declaration';

// ============================================================================
// Interfaces
// ============================================================================

export interface ExportShipment {
  shipmentId: string;
  exportId: string;
  
  // Carrier
  carrierName: string;
  vesselName?: string;
  flightNumber?: string;
  containerNumber?: string;
  
  // Dates
  estimatedDepartureDate: Date;
  actualDepartureDate?: Date;
  estimatedArrivalDate: Date;
  actualArrivalDate?: Date;
  
  // Tracking
  trackingNumber: string;
  currentLocation?: string;
  currentStatus: string;
  
  // Costs
  freightCost: number;
  insuranceCost: number;
  otherCharges: number;
  totalShippingCost: number;
  currency: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

export function calculateLandedCost(
  exportOrder: ExportOrder,
  shipment: ExportShipment,
  importDutyRate: number,
  importVATRate: number
): {
  fobValue: number;
  freight: number;
  insurance: number;
  cifValue: number;
  importDuty: number;
  importVAT: number;
  landedCost: number;
} {
  const fobValue = exportOrder.totalValue;
  const freight = shipment.freightCost;
  const insurance = shipment.insuranceCost;
  const cifValue = fobValue + freight + insurance;

  const importDuty = cifValue * (importDutyRate / 100);
  const dutyPaidValue = cifValue + importDuty;
  const importVAT = dutyPaidValue * (importVATRate / 100);
  const landedCost = dutyPaidValue + importVAT;

  return {
    fobValue: Math.round(fobValue * 100) / 100,
    freight: Math.round(freight * 100) / 100,
    insurance: Math.round(insurance * 100) / 100,
    cifValue: Math.round(cifValue * 100) / 100,
    importDuty: Math.round(importDuty * 100) / 100,
    importVAT: Math.round(importVAT * 100) / 100,
    landedCost: Math.round(landedCost * 100) / 100,
  };
}
