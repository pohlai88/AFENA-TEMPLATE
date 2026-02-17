/**
 * Carrier Management Service
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface RateRequest {
  origin: { zip: string; country: string };
  destination: { zip: string; country: string };
  packages: Array<{ weight: number; dimensions: { length: number; width: number; height: number } }>;
}

export interface ShippingRate {
  carrier: string;
  service: string;
  rate: number;
  transitDays: number;
  deliveryDate: string;
}

export interface CarrierSelection {
  carrier: string;
  service: string;
  accountNumber: string;
}

export async function getShippingRates(
  db: NeonHttpDatabase,
  orgId: string,
  params: RateRequest,
): Promise<ShippingRate[]> {
  // TODO: Call carrier APIs for rates
  return [
    { carrier: 'UPS', service: 'Ground', rate: 12.50, transitDays: 3, deliveryDate: '2025-02-20' },
    { carrier: 'FedEx', service: '2-Day', rate: 18.00, transitDays: 2, deliveryDate: '2025-02-19' },
  ];
}

export async function selectCarrier(
  db: NeonHttpDatabase,
  orgId: string,
  params: { shipmentId: string; carrier: string; service: string },
): Promise<CarrierSelection> {
  // TODO: Update shipment with carrier selection
  return {
    carrier: params.carrier,
    service: params.service,
    accountNumber: 'ACCT-12345',
  };
}
