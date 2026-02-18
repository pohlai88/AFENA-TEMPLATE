import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface TemperatureLog {
  id: string;
  equipmentId: string;
  temperature: number;
  timestamp: Date;
  location: string;
  withinRange: boolean;
  minThreshold: number;
  maxThreshold: number;
}

export async function logTemperature(
  db: NeonHttpDatabase,
  data: Omit<TemperatureLog, 'id' | 'timestamp' | 'withinRange'>,
): Promise<TemperatureLog> {
  // TODO: Insert into database
  const withinRange = data.temperature >= data.minThreshold && data.temperature <= data.maxThreshold;
  throw new Error('Database integration pending');
}

export async function getTemperatureLogs(
  db: NeonHttpDatabase,
  equipmentId: string,
  dateFrom: Date,
  dateTo: Date,
): Promise<TemperatureLog[]> {
  // TODO: Query database
  throw new Error('Database integration pending');
}

export function detectTemperatureExcursions(
  logs: TemperatureLog[],
): Array<{
  start: Date;
  end: Date;
  duration: number;
  avgTemp: number;
  severity: 'CRITICAL' | 'WARNING' | 'MINOR';
}> {
  const excursions: Array<{
    start: Date;
    end: Date;
    duration: number;
    avgTemp: number;
    severity: 'CRITICAL' | 'WARNING' | 'MINOR';
  }> = [];

  let excursionStart: Date | null = null;
  let excursionTemps: number[] = [];

  for (let i = 0; i < logs.length; i++) {
    const log = logs[i];

    if (!log.withinRange) {
      if (!excursionStart) {
        excursionStart = log.timestamp;
      }
      excursionTemps.push(log.temperature);
    } else if (excursionStart) {
      // Excursion ended
      const duration = (log.timestamp.getTime() - excursionStart.getTime()) / (1000 * 60); // minutes
      const avgTemp = excursionTemps.reduce((a, b) => a + b) / excursionTemps.length;

      let severity: 'CRITICAL' | 'WARNING' | 'MINOR' = 'MINOR';
      if (duration > 240 || Math.abs(avgTemp - log.minThreshold) > 10) {
        severity = 'CRITICAL';
      } else if (duration > 120) {
        severity = 'WARNING';
      }

      excursions.push({
        start: excursionStart,
        end: log.timestamp,
        duration,
        avgTemp,
        severity,
      });

      excursionStart = null;
      excursionTemps = [];
    }
  }

  return excursions;
}

export function calculateComplianceRate(logs: TemperatureLog[]): {
  rate: number;
  withinRange: number;
  total: number;
} {
  const withinRange = logs.filter((l) => l.withinRange).length;
  return {
    rate: logs.length > 0 ? (withinRange / logs.length) * 100 : 0,
    withinRange,
    total: logs.length,
  };
}
