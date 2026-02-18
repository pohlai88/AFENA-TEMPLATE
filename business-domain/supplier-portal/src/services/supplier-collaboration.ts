/**
 * Supplier Collaboration Service
 * Handles supplier portal functionality for PO acknowledgment, ASN, and invoice submission
 */

// ============================================================================
// Interfaces
// ============================================================================

export interface PurchaseOrderAcknowledgment {
  acknowledgmentId: string;
  purchaseOrderId: string;
  supplierId: string;
  acknowledgmentDate: Date;
  status: 'ACCEPTED' | 'PARTIALLY_ACCEPTED' | 'REJECTED' | 'CHANGES_REQUESTED';
  lines: POAcknowledgmentLine[];
  estimatedShipDate?: Date;
  expectedDeliveryDate?: Date;
  notes?: string;
  changesRequested?: string;
}

export interface POAcknowledgmentLine {
  lineNumber: number;
  status: 'ACCEPTED' | 'REJECTED' | 'QUANTITY_CHANGE' | 'DATE_CHANGE';
  orderedQuantity: number;
  confirmedQuantity: number;
  requestedDeliveryDate: Date;
  confirmedDeliveryDate: Date;
  unitPrice: number;
  confirmedPrice: number;
  rejectionReason?: string;
}

export interface AdvancedShippingNotice {
  asnId: string;
  purchaseOrderId: string;
  supplierId: string;
  shipmentDate: Date;
  estimatedArrival: Date;
  carrier: string;
  trackingNumber: string;
  status: 'DRAFTED' | 'SUBMITTED' | 'IN_TRANSIT' | 'RECEIVED' | 'DISCREPANCY';
  lines: ASNLine[];
  packingLists: PackingList[];
}

export interface ASNLine {
  lineNumber: number;
  purchaseOrderLine: number;
  productId: string;
  shippedQuantity: number;
  unitOfMeasure: string;
  batchNumbers: string[];
  serialNumbers?: string[];
  expiryDate?: Date;
  countryOfOrigin?: string;
}

export interface PackingList {
  packingListNumber: string;
  containerNumber?: string;
  palletCount: number;
  totalWeight: number;
  totalVolume: number;
  items: Array<{
    productId: string;
    quantity: number;
    palletNumber?: string;
  }>;
}

export interface SupplierInvoice {
  invoiceId: string;
  supplierInvoiceNumber: string;
  supplierId: string;
  purchaseOrderId: string;
  invoiceDate: Date;
  dueDate: Date;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'PAID';
  lines: SupplierInvoiceLine[];
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  totalAmount: number;
  attachments: string[]; // URLs to invoice PDF, supporting docs
  reviewNotes?: string;
}

export interface SupplierInvoiceLine {
  lineNumber: number;
  purchaseOrderLine: number;
  productId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  receiptNumber?: string;
  asnNumber?: string;
}

export interface CollaborationMessage {
  messageId: string;
  supplierId: string;
  customerId: string;
  documentType: 'PO' | 'ASN' | 'INVOICE' | 'QUALITY' | 'GENERAL';
  documentId?: string;
  subject: string;
  message: string;
  sentBy: 'SUPPLIER' | 'CUSTOMER';
  sentDate: Date;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'UNREAD' | 'READ' | 'REPLIED' | 'RESOLVED';
  attachments?: string[];
}

export interface SupplierPerformanceMetrics {
  supplierId: string;
  periodStart: Date;
  periodEnd: Date;
  metrics: {
    poAcknowledgmentRate: number;
    avgAcknowledgmentTime: number; // hours
    onTimeDeliveryRate: number;
    asnAccuracyRate: number;
    invoiceAccuracyRate: number;
    responseTime: number; // hours
    qualityScore: number;
  };
  complianceStatus: 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT' | 'NON_COMPLIANT';
}

// ============================================================================
// Database Operations
// ============================================================================

export async function acknowledgePurchaseOrder(
  ack: Omit<PurchaseOrderAcknowledgment, 'acknowledgmentId' | 'acknowledgmentDate'>
): Promise<PurchaseOrderAcknowledgment> {
  // TODO: Implement with Drizzle ORM
  // const acknowledgmentId = generateAcknowledgmentNumber();
  // return await db.insert(poAcknowledgments).values({ ...ack, acknowledgmentId, acknowledgmentDate: new Date() }).returning();
  throw new Error('Not implemented');
}

export async function submitASN(asn: Omit<AdvancedShippingNotice, 'asnId'>): Promise<AdvancedShippingNotice> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function updateASNStatus(
  asnId: string,
  status: AdvancedShippingNotice['status']
): Promise<void> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function submitSupplierInvoice(
  invoice: Omit<SupplierInvoice, 'invoiceId'>
): Promise<SupplierInvoice> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function reviewSupplierInvoice(
  invoiceId: string,
  status: 'APPROVED' | 'REJECTED',
  notes?: string
): Promise<void> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function sendMessage(
  message: Omit<CollaborationMessage, 'messageId' | 'sentDate'>
): Promise<CollaborationMessage> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function getSupplierPerformance(
  supplierId: string,
  startDate: Date,
  endDate: Date
): Promise<SupplierPerformanceMetrics | null> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

// ============================================================================
// Helper Functions
// ============================================================================

export function generateAcknowledgmentNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const sequence = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `ACK-${dateStr}-${sequence}`;
}

export function validatePOAcknowledgment(
  acknowledgment: PurchaseOrderAcknowledgment
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if all lines are acknowledged
  if (acknowledgment.lines.length === 0) {
    errors.push('No acknowledgment lines provided');
  }

  acknowledgment.lines.forEach(line => {
    // Price changes require explanation
    if (line.confirmedPrice !== line.unitPrice && acknowledgment.status !== 'CHANGES_REQUESTED') {
      errors.push(`Line ${line.lineNumber}: Price change requires change request`);
    }

    // Quantity reductions
    if (line.confirmedQuantity < line.orderedQuantity * 0.95) {
      warnings.push(`Line ${line.lineNumber}: Confirmed quantity is ${((line.confirmedQuantity / line.orderedQuantity) * 100).toFixed(1)}% of ordered`);
    }

    // Delivery date delays
    if (line.confirmedDeliveryDate > line.requestedDeliveryDate) {
      const delayDays = Math.round((line.confirmedDeliveryDate.getTime() - line.requestedDeliveryDate.getTime()) / (1000 * 60 * 60 * 24));
      warnings.push(`Line ${line.lineNumber}: Delivery delayed by ${delayDays} days`);
    }

    // Rejections require reason
    if (line.status === 'REJECTED' && !line.rejectionReason) {
      errors.push(`Line ${line.lineNumber}: Rejection reason required`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function calculateASNAccuracy(
  asn: AdvancedShippingNotice,
  actualReceipt: { lineNumber: number; receivedQuantity: number }[]
): {
  accuracyRate: number;
  discrepancies: Array<{
    lineNumber: number;
    shippedQty: number;
    receivedQty: number;
    variance: number;
  }>;
} {
  const discrepancies: Array<{
    lineNumber: number;
    shippedQty: number;
    receivedQty: number;
    variance: number;
  }> = [];

  let accurateLines = 0;
  const totalLines = asn.lines.length;

  asn.lines.forEach(asnLine => {
    const receipt = actualReceipt.find(r => r.lineNumber === asnLine.lineNumber);
    if (!receipt) return;

    const variance = receipt.receivedQuantity - asnLine.shippedQuantity;
    const variancePct = Math.abs(variance) / asnLine.shippedQuantity;

    // Consider accurate if within 2% tolerance
    if (variancePct <= 0.02) {
      accurateLines++;
    } else {
      discrepancies.push({
        lineNumber: asnLine.lineNumber,
        shippedQty: asnLine.shippedQuantity,
        receivedQty: receipt.receivedQuantity,
        variance,
      });
    }
  });

  const accuracyRate = totalLines > 0 ? (accurateLines / totalLines) * 100 : 0;

  return {
    accuracyRate,
    discrepancies,
  };
}

export function validate3WayMatch(
  purchaseOrder: { lines: Array<{ lineNumber: number; quantity: number; unitPrice: number }> },
  receipt: { lines: Array<{ poLineNumber: number; receivedQuantity: number }> },
  invoice: SupplierInvoice
): {
  isMatched: boolean;
  variances: Array<{
    lineNumber: number;
    type: 'QUANTITY' | 'PRICE' | 'MISSING';
    poValue?: number;
    receiptValue?: number;
    invoiceValue?: number;
  }>;
} {
  const variances: Array<{
    lineNumber: number;
    type: 'QUANTITY' | 'PRICE' | 'MISSING';
    poValue?: number;
    receiptValue?: number;
    invoiceValue?: number;
  }> = [];

  invoice.lines.forEach(invLine => {
    const poLine = purchaseOrder.lines.find(p => p.lineNumber === invLine.purchaseOrderLine);
    const receiptLine = receipt.lines.find(r => r.poLineNumber === invLine.purchaseOrderLine);

    if (!poLine) {
      variances.push({
        lineNumber: invLine.lineNumber,
        type: 'MISSING',
        invoiceValue: invLine.lineTotal,
      });
      return;
    }

    if (!receiptLine) {
      variances.push({
        lineNumber: invLine.lineNumber,
        type: 'MISSING',
        poValue: poLine.quantity * poLine.unitPrice,
        invoiceValue: invLine.lineTotal,
      });
      return;
    }

    // Price variance (2% tolerance)
    if (Math.abs(invLine.unitPrice - poLine.unitPrice) / poLine.unitPrice > 0.02) {
      variances.push({
        lineNumber: invLine.lineNumber,
        type: 'PRICE',
        poValue: poLine.unitPrice,
        invoiceValue: invLine.unitPrice,
      });
    }

    // Quantity variance (invoice shouldn't exceed receipt)
    if (invLine.quantity > receiptLine.receivedQuantity) {
      variances.push({
        lineNumber: invLine.lineNumber,
        type: 'QUANTITY',
        receiptValue: receiptLine.receivedQuantity,
        invoiceValue: invLine.quantity,
      });
    }
  });

  return {
    isMatched: variances.length === 0,
    variances,
  };
}

export function calculateSupplierComplianceScore(metrics: SupplierPerformanceMetrics['metrics']): number {
  // Weighted scoring
  const weights = {
    poAcknowledgmentRate: 0.15,
    avgAcknowledgmentTime: 0.10,
    onTimeDeliveryRate: 0.30,
    asnAccuracyRate: 0.15,
    invoiceAccuracyRate: 0.15,
    responseTime: 0.05,
    qualityScore: 0.10,
  };

  // Normalize acknowledgment time (target: < 24 hours)
  const ackTimeScore = Math.max(0, 100 - (metrics.avgAcknowledgmentTime / 24) * 100);
  
  // Normalize response time (target: < 4 hours)
  const responseTimeScore = Math.max(0, 100 - (metrics.responseTime / 4) * 100);

  const score =
    metrics.poAcknowledgmentRate * weights.poAcknowledgmentRate +
    ackTimeScore * weights.avgAcknowledgmentTime +
    metrics.onTimeDeliveryRate * weights.onTimeDeliveryRate +
    metrics.asnAccuracyRate * weights.asnAccuracyRate +
    metrics.invoiceAccuracyRate * weights.invoiceAccuracyRate +
    responseTimeScore * weights.responseTime +
    metrics.qualityScore * weights.qualityScore;

  return Math.round(score * 100) / 100;
}

export function determineComplianceStatus(score: number): SupplierPerformanceMetrics['complianceStatus'] {
  if (score >= 90) return 'EXCELLENT';
  if (score >= 75) return 'GOOD';
  if (score >= 60) return 'NEEDS_IMPROVEMENT';
  return 'NON_COMPLIANT';
}

export function identifyCollaborationIssues(
  messages: CollaborationMessage[]
): {
  unresolvedCount: number;
  urgentCount: number;
  avgResponseTime: number;
  topIssues: Array<{ documentType: string; count: number }>;
} {
  let unresolvedCount = 0;
  let urgentCount = 0;
  const documentTypeCounts = new Map<string, number>();
  let totalResponseTime = 0;
  let resolvedMessages = 0;

  messages.forEach(msg => {
    if (msg.status !== 'RESOLVED') unresolvedCount++;
    if (msg.priority === 'URGENT') urgentCount++;

    documentTypeCounts.set(
      msg.documentType,
      (documentTypeCounts.get(msg.documentType) || 0) + 1
    );

    // Simplified response time calculation
    if (msg.status === 'RESOLVED' || msg.status === 'REPLIED') {
      totalResponseTime += 24; // Placeholder
      resolvedMessages++;
    }
  });

  const topIssues = Array.from(documentTypeCounts.entries())
    .map(([documentType, count]) => ({ documentType, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const avgResponseTime = resolvedMessages > 0 ? totalResponseTime / resolvedMessages : 0;

  return {
    unresolvedCount,
    urgentCount,
    avgResponseTime,
    topIssues,
  };
}
