import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface HalalCertification {
  id: string;
  facilityId: string;
  certificationBody: string;
  certificateNumber: string;
  issueDate: Date;
  expiryDate: Date;
  scope: string[];
  status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'PENDING_RENEWAL';
  auditDate?: Date;
  auditor?: string;
}

export interface HalalCompliance {
  id: string;
  productId: string;
  halalStatus: 'CERTIFIED' | 'PENDING' | 'NON_HALAL' | 'DOUBTFUL';
  ingredients: Array<{
    name: string;
    halalStatus: 'HALAL' | 'HARAM' | 'MASHBOOH';
    source: string;
    certification?: string;
  }>;
  productionProcess: {
    segregated: boolean;
    dedicatedEquipment: boolean;
    cleaningValidated: boolean;
  };
  verifiedAt?: Date;
  verifiedBy?: string;
}

export async function createCertification(
  db: NeonHttpDatabase,
  data: Omit<HalalCertification, 'id'>,
): Promise<HalalCertification> {
  // TODO: Insert into database
  throw new Error('Database integration pending');
}

export async function getCertifications(
  db: NeonHttpDatabase,
  facilityId: string,
): Promise<HalalCertification[]> {
  // TODO: Query database
  throw new Error('Database integration pending');
}

export async function submitProductForHalalReview(
  db: NeonHttpDatabase,
  data: Omit<HalalCompliance, 'id' | 'halalStatus' | 'verifiedAt'>,
): Promise<HalalCompliance> {
  // TODO: Insert into database with PENDING status
  throw new Error('Database integration pending');
}

export async function getProductHalalStatus(
  db: NeonHttpDatabase,
  productId: string,
): Promise<HalalCompliance | null> {
  // TODO: Query database
  throw new Error('Database integration pending');
}

/**
 * Validate ingredient halal compliance
 */
export function validateIngredientCompliance(
  ingredients: HalalCompliance['ingredients'],
): {
  compliant: boolean;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check for haram ingredients
  const haramIngredients = ingredients.filter((i) => i.halalStatus === 'HARAM');
  if (haramIngredients.length > 0) {
    issues.push(
      `Contains ${haramIngredients.length} haram ingredient(s): ${haramIngredients.map((i) => i.name).join(', ')}`,
    );
    recommendations.push('Remove or replace all haram ingredients');
  }

  // Check for mashbooh (doubtful) ingredients
  const mashboohIngredients = ingredients.filter((i) => i.halalStatus === 'MASHBOOH');
  if (mashboohIngredients.length > 0) {
    issues.push(
      `Contains ${mashboohIngredients.length} doubtful ingredient(s): ${mashboohIngredients.map((i) => i.name).join(', ')}`,
    );
    recommendations.push('Obtain halal certification for doubtful ingredients or find certified alternatives');
  }

  // Check ingredient certifications
  const uncertifiedHalal = ingredients.filter(
    (i) => i.halalStatus === 'HALAL' && !i.certification,
  );
  if (uncertifiedHalal.length > 0) {
    recommendations.push(
      `${uncertifiedHalal.length} halal ingredient(s) lack certification documentation`,
    );
  }

  return {
    compliant: haramIngredients.length === 0 && mashboohIngredients.length === 0,
    issues,
    recommendations,
  };
}

/**
 * Assess production process halal compliance
 */
export function assessProductionProcess(
  process: HalalCompliance['productionProcess'],
  productType: 'MEAT' | 'DAIRY' | 'PROCESSED' | 'BEVERAGE',
): {
  compliant: boolean;
  score: number;
  criticalIssues: string[];
  improvements: string[];
} {
  let score = 0;
  const criticalIssues: string[] = [];
  const improvements: string[] = [];

  // Segregation check
  if (process.segregated) {
    score += 40;
  } else {
    criticalIssues.push('Production not segregated from non-halal products');
  }

  // Dedicated equipment check
  if (process.dedicatedEquipment) {
    score += 30;
  } else {
    if (productType === 'MEAT') {
      criticalIssues.push('Meat products require dedicated equipment');
    } else {
      improvements.push('Consider dedicated equipment for better compliance');
      score += 15; // Partial credit if cleaning is validated
    }
  }

  // Cleaning validation check
  if (process.cleaningValidated) {
    score += 30;
  } else {
    criticalIssues.push('Cleaning procedures not validated');
  }

  return {
    compliant: score >= 70 && criticalIssues.length === 0,
    score,
    criticalIssues,
    improvements,
  };
}

/**
 * Determine overall product halal status
 */
export function determineHalalStatus(
  ingredientCompliance: ReturnType<typeof validateIngredientCompliance>,
  processAssessment: ReturnType<typeof assessProductionProcess>,
): 'CERTIFIED' | 'PENDING' | 'NON_HALAL' | 'DOUBTFUL' {
  // Non-halal if any haram ingredients or critical process issues
  if (!ingredientCompliance.compliant || !processAssessment.compliant) {
    return 'NON_HALAL';
  }

  // Doubtful if recommendations exist
  if (
    ingredientCompliance.recommendations.length > 0 ||
    processAssessment.improvements.length > 0
  ) {
    return 'DOUBTFUL';
  }

  // Can be certified if fully compliant
  return 'CERTIFIED';
}

/**
 * Generate halal certification report
 */
export function generateHalalReport(
  product: HalalCompliance,
  certification?: HalalCertification,
): {
  summary: string;
  ingredientStatus: string;
  processStatus: string;
  certificationStatus: string;
  recommendations: string[];
} {
  const ingredientCompliance = validateIngredientCompliance(product.ingredients);
  const processAssessment = assessProductionProcess(
    product.productionProcess,
    'PROCESSED', // Default, should be passed as parameter
  );

  const recommendations = [
    ...ingredientCompliance.recommendations,
    ...processAssessment.improvements,
  ];

  let certificationStatus = 'Not certified';
  if (certification) {
    const daysUntilExpiry = Math.ceil(
      (certification.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );

    if (certification.status === 'ACTIVE') {
      certificationStatus = `Active until ${certification.expiryDate.toISOString().split('T')[0]}`;
      if (daysUntilExpiry < 90) {
        recommendations.push(`Certification expires in ${daysUntilExpiry} days - initiate renewal process`);
      }
    } else {
      certificationStatus = `${certification.status} - renewal required`;
      recommendations.push('Certification renewal required');
    }
  }

  return {
    summary: `Halal Status: ${product.halalStatus}`,
    ingredientStatus: ingredientCompliance.compliant
      ? 'All ingredients halal certified'
      : `${ingredientCompliance.issues.length} ingredient issue(s)`,
    processStatus: processAssessment.compliant
      ? `Production compliant (Score: ${processAssessment.score}/100)`
      : `${processAssessment.criticalIssues.length} critical process issue(s)`,
    certificationStatus,
    recommendations,
  };
}

/**
 * Check certification expiry and renewal requirements
 */
export function checkCertificationRenewal(
  certifications: HalalCertification[],
): Array<{
  certification: HalalCertification;
  daysUntilExpiry: number;
  action: 'RENEW_NOW' | 'SCHEDULE_RENEWAL' | 'MONITOR';
}> {
  const now = Date.now();

  return certifications
    .filter((cert) => cert.status === 'ACTIVE')
    .map((cert) => {
      const daysUntilExpiry = Math.ceil(
        (cert.expiryDate.getTime() - now) / (1000 * 60 * 60 * 24),
      );

      let action: 'RENEW_NOW' | 'SCHEDULE_RENEWAL' | 'MONITOR' = 'MONITOR';
      if (daysUntilExpiry < 30) {
        action = 'RENEW_NOW';
      } else if (daysUntilExpiry < 90) {
        action = 'SCHEDULE_RENEWAL';
      }

      return {
        certification: cert,
        daysUntilExpiry,
        action,
      };
    })
    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
}

/**
 * Identify common haram ingredients
 */
export function identifyHaramIngredients(ingredientName: string): {
  isHaram: boolean;
  reason?: string;
  alternatives?: string[];
} {
  const haramKeywords = {
    alcohol: {
      keywords: ['alcohol', 'ethanol', 'wine', 'beer', 'rum', 'whiskey'],
      reason: 'Contains or derived from alcohol',
      alternatives: ['Vanilla extract (alcohol-free)', 'Natural flavors'],
    },
    pork: {
      keywords: ['pork', 'lard', 'bacon', 'ham', 'gelatin (pork)', 'pepsin'],
      reason: 'Pork-derived ingredient',
      alternatives: ['Beef gelatin', 'Plant-based alternatives', 'Halal-certified gelatin'],
    },
    blood: {
      keywords: ['blood', 'plasma'],
      reason: 'Blood or blood products',
      alternatives: ['Plant-based protein', 'Egg albumin'],
    },
    enzymes: {
      keywords: ['rennet', 'lipase', 'pepsin'],
      reason: 'Animal-derived enzyme (source uncertain)',
      alternatives: ['Microbial enzymes', 'Vegetarian rennet'],
    },
  };

  const lowerName = ingredientName.toLowerCase();

  for (const [category, data] of Object.entries(haramKeywords)) {
    if (data.keywords.some((kw) => lowerName.includes(kw))) {
      return {
        isHaram: true,
        reason: data.reason,
        alternatives: data.alternatives,
      };
    }
  }

  return { isHaram: false };
}
