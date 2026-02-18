import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { Territory, TerritoryAnalysis, TerritoryStatus } from '../types/common.js';

/**
 * Create a new franchise territory with exclusivity rights
 */
export async function createTerritory(
  db: NeonHttpDatabase,
  orgId: string,
  data: Omit<Territory, 'id' | 'createdAt'>,
): Promise<Territory> {
  // TODO: Insert into database
  // INSERT INTO territories (org_id, name, status, exclusivity_radius, ...)
  throw new Error('Database integration pending');
}

/**
 * Get all territories for an organization
 */
export async function getTerritories(
  db: NeonHttpDatabase,
  orgId: string,
  status?: TerritoryStatus,
): Promise<Territory[]> {
  // TODO: Query database with optional status filter
  throw new Error('Database integration pending');
}

/**
 * Assign territory to a franchise candidate (reserve)
 */
export async function assignTerritory(
  db: NeonHttpDatabase,
  territoryId: string,
  candidateId: string,
): Promise<Territory> {
  // TODO: Update territory status to RESERVED and set assigned_candidate_id
  throw new Error('Database integration pending');
}

/**
 * Analyze territory demographics and market potential
 */
export function analyzeTerritory(territory: Territory): TerritoryAnalysis {
  const population = territory.population || 0;
  const radius = territory.exclusivityRadius;
  
  // Simple scoring logic - replace with real demographic analysis
  const coverage = (population / (radius * radius)) * 100;
  const competition = 0; // TODO: Integrate with competitor data
  const recommended = coverage > 50 && population > 10000;

  return {
    territoryId: territory.id,
    coverage,
    population,
    competition,
    recommended,
  };
}

/**
 * Check for territory overlap/encroachment
 */
export function checkTerritoryOverlap(
  newTerritory: { latitude: number; longitude: number; radius: number },
  existingTerritories: Array<{ latitude: number; longitude: number; radius: number }>,
): boolean {
  // Haversine distance calculation for geographic overlap
  for (const existing of existingTerritories) {
    const distance = calculateDistance(
      newTerritory.latitude,
      newTerritory.longitude,
      existing.latitude,
      existing.longitude,
    );
    
    if (distance < (newTerritory.radius + existing.radius)) {
      return true; // Overlap detected
    }
  }
  return false;
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Generate territory map visualization data
 */
export function generateTerritoryMap(territories: Territory[]): {
  available: number;
  reserved: number;
  developed: number;
  totalCoverage: number;
} {
  const summary = {
    available: 0,
    reserved: 0,
    developed: 0,
    totalCoverage: 0,
  };

  for (const territory of territories) {
    switch (territory.status) {
      case 'AVAILABLE':
        summary.available++;
        break;
      case 'RESERVED':
        summary.reserved++;
        break;
      case 'DEVELOPED':
        summary.developed++;
        break;
    }
    summary.totalCoverage += territory.exclusivityRadius;
  }

  return summary;
}

