import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const CreateCustomsDeclarationParams = z.object({
  shipmentId: z.string(),
  countryOfOrigin: z.string(),
  destinationCountry: z.string(),
  items: z.array(
    z.object({
      itemId: z.string(),
      hsCode: z.string(),
      quantity: z.number(),
      value: z.number(),
      weight: z.number(),
    }),
  ),
  incoterms: z.enum(['EXW', 'FCA', 'FOB', 'CFR', 'CIF', 'DAP', 'DDP']),
});

export interface CustomsDeclaration {
  declarationId: string;
  shipmentId: string;
  countryOfOrigin: string;
  destinationCountry: string;
  totalValue: number;
  totalDuty: number;
  items: {
    itemId: string;
    hsCode: string;
    description: string;
    quantity: number;
    value: number;
    dutyRate: number;
    dutyAmount: number;
  }[];
  status: 'draft' | 'submitted' | 'cleared' | 'held';
  createdAt: Date;
}

export async function createCustomsDeclaration(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof CreateCustomsDeclarationParams>,
): Promise<Result<CustomsDeclaration>> {
  const validated = CreateCustomsDeclarationParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Create customs declaration with HS code lookup
  const totalValue = validated.data.items.reduce((sum, item) => sum + item.value, 0);

  return ok({
    declarationId: `customs-${Date.now()}`,
    shipmentId: validated.data.shipmentId,
    countryOfOrigin: validated.data.countryOfOrigin,
    destinationCountry: validated.data.destinationCountry,
    totalValue,
    totalDuty: 0,
    items: validated.data.items.map((item) => ({
      itemId: item.itemId,
      hsCode: item.hsCode,
      description: '',
      quantity: item.quantity,
      value: item.value,
      dutyRate: 0,
      dutyAmount: 0,
    })),
    status: 'draft',
    createdAt: new Date(),
  });
}

const ClassifyHSCodeParams = z.object({
  itemId: z.string(),
  description: z.string(),
  material: z.string().optional(),
  intendedUse: z.string().optional(),
});

export interface HSCodeClassification {
  itemId: string;
  hsCode: string;
  hsDescription: string;
  chapter: string;
  heading: string;
  confidence: number;
  alternativeCodes: { hsCode: string; description: string }[];
}

export async function classifyHSCode(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof ClassifyHSCodeParams>,
): Promise<Result<HSCodeClassification>> {
  const validated = ClassifyHSCodeParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: AI-powered HS code classification
  return ok({
    itemId: validated.data.itemId,
    hsCode: '8471.30',
    hsDescription: 'Portable automatic data processing machines',
    chapter: '84',
    heading: '8471',
    confidence: 0.85,
    alternativeCodes: [],
  });
}

const SubmitDeclarationParams = z.object({
  declarationId: z.string(),
  customsBroker: z.string().optional(),
  entryType: z.enum(['formal', 'informal', 'courier']),
});

export interface DeclarationSubmission {
  declarationId: string;
  submissionId: string;
  submittedAt: Date;
  customsBroker?: string;
  entryNumber?: string;
  estimatedClearanceDate: Date;
  status: 'submitted' | 'processing' | 'cleared' | 'held';
  trackingUrl?: string;
}

export async function submitDeclaration(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof SubmitDeclarationParams>,
): Promise<Result<DeclarationSubmission>> {
  const validated = SubmitDeclarationParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Submit declaration to customs system
  const estimatedClearanceDate = new Date();
  estimatedClearanceDate.setDate(estimatedClearanceDate.getDate() + 2);

  return ok({
    declarationId: validated.data.declarationId,
    submissionId: `sub-${Date.now()}`,
    submittedAt: new Date(),
    customsBroker: validated.data.customsBroker,
    entryNumber: undefined,
    estimatedClearanceDate,
    status: 'submitted',
    trackingUrl: undefined,
  });
}

const GetDeclarationStatusParams = z.object({
  declarationId: z.string(),
});

export interface DeclarationStatus {
  declarationId: string;
  status: 'draft' | 'submitted' | 'processing' | 'cleared' | 'held' | 'rejected';
  currentStep: string;
  clearanceDate?: Date;
  holdReason?: string;
  requiredActions: string[];
  timeline: {
    event: string;
    timestamp: Date;
    notes?: string;
  }[];
}

export async function getDeclarationStatus(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof GetDeclarationStatusParams>,
): Promise<Result<DeclarationStatus>> {
  const validated = GetDeclarationStatusParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Query declaration status from DB and customs system
  return ok({
    declarationId: validated.data.declarationId,
    status: 'draft',
    currentStep: 'Awaiting submission',
    clearanceDate: undefined,
    holdReason: undefined,
    requiredActions: [],
    timeline: [],
  });
}
