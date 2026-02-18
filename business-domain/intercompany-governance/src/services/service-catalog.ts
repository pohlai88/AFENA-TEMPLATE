/**
 * IC Service Catalog Service
 *
 * Manages intercompany service catalog, service agreements, and markup rules for transfer pricing compliance.
 */

import { z } from 'zod';

// Schemas
export const createServiceCatalogSchema = z.object({
  serviceCode: z.string().min(1),
  serviceName: z.string().min(1),
  serviceCategory: z.enum(['shared-services', 'management-fees', 'royalties', 'it-services', 'consulting', 'r&d', 'finance', 'hr', 'legal']),
  description: z.string(),
  unitOfMeasure: z.enum(['hours', 'fte', 'users', 'transactions', 'percentage-of-revenue', 'fixed-fee']),
  standardCost: z.number().min(0),
  markupPercent: z.number().min(0).max(500),
  transferPricingMethod: z.enum(['cost-plus', 'resale-price', 'tnmm', 'cup', 'profit-split']),
  effectiveDate: z.string().datetime(),
  expirationDate: z.string().datetime().optional(),
});

export const createServiceAgreementSchema = z.object({
  providerEntityId: z.string().uuid(),
  receiverEntityId: z.string().uuid(),
  serviceCode: z.string().min(1),
  agreementType: z.enum(['master-service', 'annual-service', 'project-based', 'ad-hoc']),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  billingFrequency: z.enum(['monthly', 'quarterly', 'annually', 'on-delivery', 'milestone']),
  paymentTerms: z.string(),
  currency: z.string().length(3),
  markupOverride: z.number().min(0).max(500).optional(),
  volumeCommitment: z.number().min(0).optional(),
  notes: z.string().optional(),
});

// Types
export type CreateServiceCatalogInput = z.infer<typeof createServiceCatalogSchema>;
export type CreateServiceAgreementInput = z.infer<typeof createServiceAgreementSchema>;

export interface ServiceCatalogItem {
  id: string;
  serviceCode: string;
  serviceName: string;
  serviceCategory: string;
  description: string;
  unitOfMeasure: string;
  standardCost: number;
  markupPercent: number;
  transferPricingMethod: string;
  effectiveDate: string;
  expirationDate: string | null;
}

export interface ServiceAgreement {
  id: string;
  providerEntityId: string;
  receiverEntityId: string;
  serviceCode: string;
  agreementType: string;
  startDate: string;
  endDate: string | null;
  billingFrequency: string;
  paymentTerms: string;
  currency: string;
  markupOverride: number | null;
  volumeCommitment: number | null;
  notes: string | null;
  status: 'active' | 'expired' | 'terminated';
}

/**
 * Create service catalog item for intercompany services.
 *
 * Defines standard services with transfer pricing markup rules for IC transactions.
 *
 * @param input - Service catalog details
 * @returns Created service catalog item
 *
 * @example
 * ```typescript
 * const service = await createServiceCatalog({
 *   serviceCode: 'IT-001',
 *   serviceName: 'IT Infrastructure Support',
 *   serviceCategory: 'it-services',
 *   description: 'Server hosting, network, help desk support',
 *   unitOfMeasure: 'users',
 *   standardCost: 100, // $100 per user per month
 *   markupPercent: 8, // 8% cost-plus markup (OECD arm's length)
 *   transferPricingMethod: 'cost-plus',
 *   effectiveDate: '2024-01-01T00:00:00Z',
 * });
 * // IC invoice: $100 cost × 1.08 markup = $108 per user
 * ```
 */
export async function createServiceCatalog(
  input: CreateServiceCatalogInput
): Promise<ServiceCatalogItem> {
  const validated = createServiceCatalogSchema.parse(input);

  // TODO: Implement service catalog creation:
  // 1. Validate serviceCode is unique
  // 2. Validate transfer pricing method matches markup rule:
  //    - Cost-plus: markup on cost (e.g., cost × 1.08)
  //    - Resale price: markup from resale price (e.g., resale price × 0.90)
  //    - TNMM: transactional net margin method (operating margin target)
  //    - CUP: comparable uncontrolled price (market price)
  //    - Profit split: split profits by function (R&D vs. distribution)
  // 3. Validate markup is within arm's length range:
  //    - Routine services: 5-10% markup
  //    - High-value services (R&D, IP): 10-30% markup
  //    - Management fees: 3-8% markup
  // 4. Store in ic_service_catalog table
  // 5. Create audit trail for transfer pricing documentation
  // 6. Link to OECD method documentation (Master File)

  return {
    id: 'service-uuid',
    serviceCode: validated.serviceCode,
    serviceName: validated.serviceName,
    serviceCategory: validated.serviceCategory,
    description: validated.description,
    unitOfMeasure: validated.unitOfMeasure,
    standardCost: validated.standardCost,
    markupPercent: validated.markupPercent,
    transferPricingMethod: validated.transferPricingMethod,
    effectiveDate: validated.effectiveDate,
    expirationDate: validated.expirationDate || null,
  };
}

/**
 * Create service agreement between IC entities.
 *
 * Defines billing frequency, payment terms, and markup overrides for specific entity pairs.
 *
 * @param input - Service agreement details
 * @returns Created service agreement
 *
 * @example
 * ```typescript
 * const agreement = await createServiceAgreement({
 *   providerEntityId: 'us-sharedservices',
 *   receiverEntityId: 'uk-subsidiary',
 *   serviceCode: 'IT-001',
 *   agreementType: 'annual-service',
 *   startDate: '2024-01-01T00:00:00Z',
 *   endDate: '2024-12-31T00:00:00Z',
 *   billingFrequency: 'monthly',
 *   paymentTerms: 'Net 30',
 *   currency: 'USD',
 *   volumeCommitment: 500, // 500 users minimum
 * });
 * ```
 */
export async function createServiceAgreement(
  input: CreateServiceAgreementInput
): Promise<ServiceAgreement> {
  const validated = createServiceAgreementSchema.parse(input);

  // TODO: Implement service agreement creation:
  // 1. Validate provider and receiver entities exist
  // 2. Validate serviceCode exists in catalog
  // 3. Validate entities are related (parent-sub or sister companies)
  // 4. Check for existing agreement conflicts (overlapping dates, same service)
  // 5. Apply markup override if specified (requires TP documentation):
  //    - Override must be within arm's length range
  //    - Justify variance from standard markup (volume discount, market conditions)
  // 6. Store in ic_service_agreements table
  // 7. Create reminder for agreement renewal (30 days before endDate)
  // 8. Generate service agreement PDF for legal/TP files

  return {
    id: 'agreement-uuid',
    providerEntityId: validated.providerEntityId,
    receiverEntityId: validated.receiverEntityId,
    serviceCode: validated.serviceCode,
    agreementType: validated.agreementType,
    startDate: validated.startDate,
    endDate: validated.endDate || null,
    billingFrequency: validated.billingFrequency,
    paymentTerms: validated.paymentTerms,
    currency: validated.currency,
    markupOverride: validated.markupOverride || null,
    volumeCommitment: validated.volumeCommitment || null,
    notes: validated.notes || null,
    status: 'active',
  };
}
