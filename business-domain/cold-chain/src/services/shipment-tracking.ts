import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface ShipmentTracking {
  id: string;
  shipmentNumber: string;
  origin: string;
  destination: string;
  departureTime: Date;
  arrivalTime?: Date;
  requiredTemp: { min: number; max: number };
  currentTemp?: number;
  status: 'IN_TRANSIT' | 'DELIVERED' | 'DELAYED' | 'COMPROMISED';
  alerts: string[];
}

export async function createShipment(
  db: NeonHttpDatabase,
  data: Omit<ShipmentTracking, 'id' | 'status' | 'alerts'>,
): Promise<ShipmentTracking> {
  // TODO: Insert into database with IN_TRANSIT status
  throw new Error('Database integration pending');
}

export async function updateShipmentTemp(
  db: NeonHttpDatabase,
  shipmentId: string,
  temperature: number,
): Promise<ShipmentTracking> {
  // TODO: Update temperature and check for excursions
  throw new Error('Database integration pending');
}

export function assessShipmentRisk(
  shipment: ShipmentTracking,
  tempLogs: Array<{ timestamp: Date; temp: number }>,
): {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors: string[];
  recommendation: string;
} {
  const factors: string[] = [];
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';

  // Check temperature excursions
  const excursions = tempLogs.filter(
    (log) => log.temp < shipment.requiredTemp.min || log.temp > shipment.requiredTemp.max,
  );

  if (excursions.length > 0) {
    factors.push(`${excursions.length} temperature excursion(s) detected`);
    riskLevel = excursions.length > 5 ? 'HIGH' : 'MEDIUM';
  }

  // Check transit time
  if (shipment.arrivalTime) {
    const transitHours =
      (shipment.arrivalTime.getTime() - shipment.departureTime.getTime()) / (1000 * 60 * 60);
    if (transitHours > 48) {
      factors.push(`Extended transit time: ${transitHours.toFixed(1)} hours`);
      riskLevel = riskLevel === 'LOW' ? 'MEDIUM' : 'HIGH';
    }
  }

  let recommendation = 'Product acceptable for use';
  if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
    recommendation = 'Quality inspection required before acceptance';
  } else if (riskLevel === 'MEDIUM') {
    recommendation = 'Monitor closely upon receipt';
  }

  return { riskLevel, factors, recommendation };
}
