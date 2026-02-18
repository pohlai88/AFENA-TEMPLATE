import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface Shipment {
  id: string;
  orgId: string;
  shipmentNumber: string;
  salesOrderId?: string;
  transferOrderId?: string;
  carrier: string;
  trackingNumber?: string;
  shipFromLocationId: string;
  shipToAddress: string;
  shipDate: Date;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  status: 'PENDING' | 'PICKED' | 'PACKED' | 'SHIPPED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  totalWeight?: number;
  totalCost?: number;
}

export interface ShipmentLine {
  id: string;
  shipmentId: string;
  itemId: string;
  quantity: number;
  serialNumbers?: string[];
  packageNumber?: string;
}

export async function createShipment(
  db: NeonHttpDatabase,
  data: Omit<Shipment, 'id' | 'shipmentNumber' | 'status'>,
): Promise<Shipment> {
  // TODO: Generate shipment number and insert with PENDING status
  throw new Error('Database integration pending');
}

export async function addShipmentLine(
  db: NeonHttpDatabase,
  data: Omit<ShipmentLine, 'id'>,
): Promise<ShipmentLine> {
  // TODO: Insert shipment line
  throw new Error('Database integration pending');
}

export async function updateShipmentStatus(
  db: NeonHttpDatabase,
  shipmentId: string,
  status: Shipment['status'],
): Promise<Shipment> {
  // TODO: Update shipment status
  throw new Error('Database integration pending');
}

export async function trackShipment(
  db: NeonHttpDatabase,
  trackingNumber: string,
): Promise<{ status: string; location?: string; estimatedDelivery?: Date }> {
  // TODO: Call carrier API for tracking info
  throw new Error('Database integration pending');
}

export function generateShipmentNumber(
  orgId: string,
  sequence: number,
): string {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  return `SHIP-${orgId}-${year}${month}-${String(sequence).padStart(6, '0')}`;
}

export function calculateShippingCost(
  weight: number, // in kg
  distance: number, // in km
  carrier: string,
  serviceLexvel: 'ECONOMY' | 'STANDARD' | 'EXPRESS',
): number {
  // Base rates per kg per km
  const baseCosts = {
    ECONOMY: 0.50,
    STANDARD: 0.75,
    EXPRESS: 1.25,
  };

  const baseRate = baseCosts[serviceLevel];
  let cost = weight * baseRate + distance * 0.10;

  // Carrier adjustments
  if (carrier.toLowerCase().includes('fedex')) {
    cost *= 1.1;
  } else if (carrier.toLowerCase().includes('dhl')) {
    cost *= 1.15;
  }

  return Math.round(cost * 100) / 100;
}

export function calculateOnTimeDelivery(
  shipments: Shipment[],
): { onTimeCount: number; lateCount: number; onTimeRate: number } {
  const delivered = shipments.filter(
    (s) => s.status === 'DELIVERED' && s.actualDeliveryDate && s.estimatedDeliveryDate,
  );

  let onTimeCount = 0;
  let lateCount = 0;

  for (const shipment of delivered) {
    if (shipment.actualDeliveryDate! <= shipment.estimatedDeliveryDate!) {
      onTimeCount++;
    } else {
      lateCount++;
    }
  }

  const total = delivered.length;
  const onTimeRate = total > 0 ? (onTimeCount / total) * 100 : 0;

  return { onTimeCount, lateCount, onTimeRate };
}

export function optimizeCarrierSelection(
  shipment: { weight: number; destination: string; targetDeliveryDate: Date },
  carriers: Array<{ name: string; cost: number; transitDays: number; reliability: number }>,
): { recommendedCarrier: string; reason: string } {
  const daysUntilTarget = Math.floor(
    (shipment.targetDeliveryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  // Filter carriers that can meet deadline
  const viable = carriers.filter((c) => c.transitDays <= daysUntilTarget);

  if (viable.length === 0) {
    return {
      recommendedCarrier: carriers[0].name,
      reason: 'No carriers can meet target date - using fastest option',
    };
  }

  // Calculate score: cost (40%), reliability (40%), speed (20%)
  const scored = viable.map((carrier) => {
    const costScore = Math.max(0, 100 - (carrier.cost / 100));
    const speedScore = Math.max(0, 100 - (carrier.transitDays * 10));
    const reliabilityScore = carrier.reliability;

    const totalScore = costScore * 0.4 + reliabilityScore * 0.4 + speedScore * 0.2;

    return { ...carrier, totalScore };
  });

  const best = scored.reduce((max, current) => 
    current.totalScore > max.totalScore ? current : max
  );

  return {
    recommendedCarrier: best.name,
    reason: `Best balance of cost ($${best.cost}), reliability (${best.reliability}%), and speed (${best.transitDays} days)`,
  };
}
