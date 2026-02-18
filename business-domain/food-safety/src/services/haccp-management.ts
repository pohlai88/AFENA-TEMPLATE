import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface HACCPPlan {
  id: string;
  facilityId: string;
  productName: string;
  hazardAnalysis: Array<{
    step: string;
    hazard: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    likelihood: 'HIGH' | 'MEDIUM' | 'LOW';
    controlMeasure: string;
  }>;
  criticalControlPoints: Array<{
    ccpNumber: number;
    processStep: string;
    criticalLimit: string;
    monitoringProcedure: string;
    correctiveAction: string;
  }>;
  approvedAt?: Date;
  approvedBy?: string;
}

export async function createHACCPPlan(
  db: NeonHttpDatabase,
  data: Omit<HACCPPlan, 'id'>,
): Promise<HACCPPlan> {
  // TODO: Insert into database
  throw new Error('Database integration pending');
}

export async function getHACCPPlans(
  db: NeonHttpDatabase,
  facilityId: string,
): Promise<HACCPPlan[]> {
  // TODO: Query database
  throw new Error('Database integration pending');
}

export function performHazardAnalysis(
  processSteps: Array<{ step: string; hazards: string[] }>,
): HACCPPlan['hazardAnalysis'] {
  return processSteps.flatMap((step) =>
    step.hazards.map((hazard) => ({
      step: step.step,
      hazard,
      severity: categorizeSeverity(hazard),
      likelihood: 'MEDIUM' as const,
      controlMeasure: suggestControlMeasure(hazard),
    })),
  );
}

function categorizeSeverity(hazard: string): 'HIGH' | 'MEDIUM' | 'LOW' {
  if (hazard.toLowerCase().includes('pathogen') || hazard.toLowerCase().includes('allergen')) {
    return 'HIGH';
  }
  if (hazard.toLowerCase().includes('contamination')) {
    return 'MEDIUM';
  }
  return 'LOW';
}

function suggestControlMeasure(hazard: string): string {
  const measures: Record<string, string> = {
    pathogen: 'Temperature control and time monitoring',
    allergen: 'Segregation and dedicated equipment',
    contamination: 'Sanitation and hygiene protocols',
    chemical: 'Proper storage and labeling',
  };
  
  for (const [key, measure] of Object.entries(measures)) {
    if (hazard.toLowerCase().includes(key)) return measure;
  }
  
  return 'Standard food safety protocols';
}

export function identifyCriticalControlPoints(
  hazardAnalysis: HACCPPlan['hazardAnalysis'],
): Array<{ step: string; hazard: string; justification: string }> {
  return hazardAnalysis
    .filter((analysis) => analysis.severity === 'HIGH')
    .map((analysis) => ({
      step: analysis.step,
      hazard: analysis.hazard,
      justification: `High severity hazard requires critical control point`,
    }));
}
