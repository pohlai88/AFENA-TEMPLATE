import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const GenerateTradeDocumentsParams = z.object({
  shipmentId: z.string(),
  documentTypes: z.array(
    z.enum([
      'commercial_invoice',
      'packing_list',
      'certificate_of_origin',
      'bill_of_lading',
      'air_waybill',
      'shipper_export_declaration',
    ]),
  ),
  exporterInfo: z.object({
    name: z.string(),
    address: z.string(),
    taxId: z.string(),
  }),
  consigneeInfo: z.object({
    name: z.string(),
    address: z.string(),
    taxId: z.string().optional(),
  }),
});

export interface TradeDocuments {
  shipmentId: string;
  documents: {
    documentType: string;
    documentId: string;
    documentNumber: string;
    generatedAt: Date;
    fileUrl?: string;
    status: 'draft' | 'final' | 'transmitted';
  }[];
  packageReady: boolean;
  missingDocuments: string[];
}

export async function generateTradeDocuments(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof GenerateTradeDocumentsParams>,
): Promise<Result<TradeDocuments>> {
  const validated = GenerateTradeDocumentsParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Generate trade documents (PDF generation)
  const documents = validated.data.documentTypes.map((docType) => ({
    documentType: docType,
    documentId: `doc-${Date.now()}-${docType}`,
    documentNumber: `${docType.toUpperCase()}-${Date.now()}`,
    generatedAt: new Date(),
    fileUrl: undefined,
    status: 'draft' as const,
  }));

  return ok({
    shipmentId: validated.data.shipmentId,
    documents,
    packageReady: false,
    missingDocuments: [],
  });
}

const CreateCommercialInvoiceParams = z.object({
  shipmentId: z.string(),
  invoiceNumber: z.string(),
  invoiceDate: z.date(),
  items: z.array(
    z.object({
      description: z.string(),
      hsCode: z.string(),
      quantity: z.number(),
      unitPrice: z.number(),
      countryOfOrigin: z.string(),
    }),
  ),
  currency: z.string(),
  incoterms: z.string(),
  paymentTerms: z.string(),
});

export interface CommercialInvoice {
  invoiceId: string;
  invoiceNumber: string;
  invoiceDate: Date;
  totalValue: number;
  currency: string;
  items: {
    lineNumber: number;
    description: string;
    hsCode: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    countryOfOrigin: string;
  }[];
  incoterms: string;
  paymentTerms: string;
  signatures: {
    signedBy?: string;
    signedAt?: Date;
  };
  pdfUrl?: string;
}

export async function createCommercialInvoice(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof CreateCommercialInvoiceParams>,
): Promise<Result<CommercialInvoice>> {
  const validated = CreateCommercialInvoiceParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Create commercial invoice
  const items = validated.data.items.map((item, index) => ({
    lineNumber: index + 1,
    description: item.description,
    hsCode: item.hsCode,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    totalPrice: item.quantity * item.unitPrice,
    countryOfOrigin: item.countryOfOrigin,
  }));

  const totalValue = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return ok({
    invoiceId: `inv-${Date.now()}`,
    invoiceNumber: validated.data.invoiceNumber,
    invoiceDate: validated.data.invoiceDate,
    totalValue,
    currency: validated.data.currency,
    items,
    incoterms: validated.data.incoterms,
    paymentTerms: validated.data.paymentTerms,
    signatures: {},
    pdfUrl: undefined,
  });
}

const GenerateCertificateOfOriginParams = z.object({
  shipmentId: z.string(),
  countryOfOrigin: z.string(),
  preferentialTreatment: z.boolean(),
  tradeAgreement: z.string().optional(),
});

export interface CertificateOfOrigin {
  certificateId: string;
  certificateNumber: string;
  shipmentId: string;
  countryOfOrigin: string;
  issuedDate: Date;
  expiryDate: Date;
  preferentialTreatment: boolean;
  tradeAgreement?: string;
  certifyingAuthority: string;
  items: {
    description: string;
    hsCode: string;
    originCriteria: string;
  }[];
  status: 'pending' | 'issued' | 'expired';
}

export async function generateCertificateOfOrigin(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof GenerateCertificateOfOriginParams>,
): Promise<Result<CertificateOfOrigin>> {
  const validated = GenerateCertificateOfOriginParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Generate certificate of origin
  const issuedDate = new Date();
  const expiryDate = new Date(issuedDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);

  return ok({
    certificateId: `coo-${Date.now()}`,
    certificateNumber: `COO-${Date.now()}`,
    shipmentId: validated.data.shipmentId,
    countryOfOrigin: validated.data.countryOfOrigin,
    issuedDate,
    expiryDate,
    preferentialTreatment: validated.data.preferentialTreatment,
    tradeAgreement: validated.data.tradeAgreement,
    certifyingAuthority: 'Chamber of Commerce',
    items: [],
    status: 'pending',
  });
}

const GetDocumentStatusParams = z.object({
  shipmentId: z.string(),
});

export interface DocumentStatus {
  shipmentId: string;
  completionPercent: number;
  requiredDocuments: string[];
  completedDocuments: string[];
  pendingDocuments: string[];
  documents: {
    documentType: string;
    status: string;
    lastModified: Date;
  }[];
  readyForShipment: boolean;
}

export async function getDocumentStatus(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof GetDocumentStatusParams>,
): Promise<Result<DocumentStatus>> {
  const validated = GetDocumentStatusParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Query document status
  return ok({
    shipmentId: validated.data.shipmentId,
    completionPercent: 0,
    requiredDocuments: [],
    completedDocuments: [],
    pendingDocuments: [],
    documents: [],
    readyForShipment: false,
  });
}
