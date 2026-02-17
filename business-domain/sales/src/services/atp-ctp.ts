/**
 * ATP/CTP Service
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface ATPResult {
  productId: string;
  requestedQuantity: number;
  availableQuantity: number;
  availableDate: string;
  sources: Array<{
    location: string;
    quantity: number;
  }>;
}

export interface CTPResult {
  productId: string;
  requestedQuantity: number;
  capableQuantity: number;
  productionLeadTime: number;
  promisedDate: string;
}

export interface InventoryReservation {
  reservationId: string;
  orderId: string;
  productId: string;
  quantity: number;
  expiresAt: string;
}

export async function checkAvailableToPromise(
  db: NeonHttpDatabase,
  orgId: string,
  params: {
    productId: string;
    requestedQuantity: number;
    requestedDate: string;
  },
): Promise<ATPResult> {
  // TODO: Query on-hand inventory
  // TODO: Subtract existing reservations
  // TODO: Add planned receipts
  // TODO: Find optimal locations
  
  return {
    productId: params.productId,
    requestedQuantity: params.requestedQuantity,
    availableQuantity: params.requestedQuantity,
    availableDate: params.requestedDate,
    sources: [
      { location: 'WH-01', quantity: params.requestedQuantity },
    ],
  };
}

export async function checkCapableToPromise(
  db: NeonHttpDatabase,
  orgId: string,
  params: {
    productId: string;
    requestedQuantity: number;
    requestedDate: string;
  },
): Promise<CTPResult> {
  // TODO: Check production capacity
  // TODO: Calculate lead time
  // TODO: Consider material availability
  
  return {
    productId: params.productId,
    requestedQuantity: params.requestedQuantity,
    capableQuantity: params.requestedQuantity,
    productionLeadTime: 14,
    promisedDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  };
}

export async function reserveInventory(
  db: NeonHttpDatabase,
  orgId: string,
  params: {
    orderId: string;
    productId: string;
    quantity: number;
    expiresInHours?: number;
  },
): Promise<InventoryReservation> {
  const reservationId = `RES-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;
  const expiresAt = new Date(Date.now() + (params.expiresInHours || 24) * 60 * 60 * 1000).toISOString();
  
  // TODO: Create reservation record
  // TODO: Update ATP calculations
  
  return {
    reservationId,
    orderId: params.orderId,
    productId: params.productId,
    quantity: params.quantity,
    expiresAt,
  };
}
