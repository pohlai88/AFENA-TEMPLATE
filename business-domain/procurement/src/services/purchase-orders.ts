import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface PurchaseRequisition {
  id: string;
  orgId: string;
  requestorId: string;
  requestDate: Date;
  requiredDate: Date;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'CONVERTED';
  totalAmount: number;
  lines: Array<{
    itemId: string;
    description: string;
    quantity: number;
    estimatedPrice: number;
    amount: number;
  }>;
}

export interface PurchaseOrder {
  id: string;
  orgId: string;
  poNumber: string;
  vendorId: string;
  orderDate: Date;
  deliveryDate: Date;
  status: 'DRAFT' | 'SENT' | 'ACKNOWLEDGED' | 'PARTIAL' | 'RECEIVED' | 'CANCELLED';
  totalAmount: number;
  lines: Array<{
    itemId: string;
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    receivedQuantity: number;
  }>;
}

export async function createRequisition(
  db: NeonHttpDatabase,
  data: Omit<PurchaseRequisition, 'id' | 'status'>,
): Promise<PurchaseRequisition> {
  // TODO: Insert into database with DRAFT status
  throw new Error('Database integration pending');
}

export async function approveRequisition(
  db: NeonHttpDatabase,
  requisitionId: string,
  approvedBy: string,
): Promise<PurchaseRequisition> {
  // TODO: Update status to APPROVED
  throw new Error('Database integration pending');
}

export async function createPurchaseOrder(
  db: NeonHttpDatabase,
  data: Omit<PurchaseOrder, 'id' | 'status' | 'poNumber'>,
): Promise<PurchaseOrder> {
  // TODO: Generate PO number and insert into database
  throw new Error('Database integration pending');
}

export async function receiveGoods(
  db: NeonHttpDatabase,
  poId: string,
  lineItems: Array<{ itemId: string; quantity: number }>,
): Promise<PurchaseOrder> {
  // TODO: Update received quantities and PO status
  throw new Error('Database integration pending');
}

export function generatePONumber(orgId: string, sequence: number): string {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  return `PO-${orgId}-${year}${month}-${String(sequence).padStart(5, '0')}`;
}

export function validatePOApproval(
  po: PurchaseOrder,
  approvalLimits: Array<{ role: string; limit: number }>,
  approverRole: string,
): { approved: boolean; reason?: string } {
  const limit = approvalLimits.find((l) => l.role === approverRole);

  if (!limit) {
    return { approved: false, reason: 'Approver role not found' };
  }

  if (po.totalAmount > limit.limit) {
    return { approved: false, reason: `Amount exceeds approval limit of ${limit.limit}` };
  }

  return { approved: true };
}

export function calculateLeadTime(
  orderDate: Date,
  deliveryDate: Date,
  actualReceiptDate?: Date,
): { plannedLeadTime: number; actualLeadTime?: number; variance?: number } {
  const plannedLeadTime = Math.floor(
    (deliveryDate.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (actualReceiptDate) {
    const actualLeadTime = Math.floor(
      (actualReceiptDate.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    return {
      plannedLeadTime,
      actualLeadTime,
      variance: actualLeadTime - plannedLeadTime,
    };
  }

  return { plannedLeadTime };
}
