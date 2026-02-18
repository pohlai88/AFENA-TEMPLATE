/**
 * IC Invoicing Service
 *
 * Automates intercompany invoice generation based on service agreements, cost allocations, and transfer pricing rules.
 */

import { z } from 'zod';

// Schemas
export const generateICInvoiceSchema = z.object({
  providerEntityId: z.string().uuid(),
  receiverEntityId: z.string().uuid(),
  serviceAgreementId: z.string().uuid(),
  billingPeriodStart: z.string().datetime(),
  billingPeriodEnd: z.string().datetime(),
  lineItems: z.array(z.object({
    serviceCode: z.string(),
    description: z.string(),
    quantity: z.number().min(0),
    unitCost: z.number().min(0),
    markupPercent: z.number().min(0),
  })).min(1),
  currency: z.string().length(3),
  notes: z.string().optional(),
});

export const approveICInvoiceSchema = z.object({
  invoiceId: z.string().uuid(),
  approverUserId: z.string().uuid(),
  approvalNotes: z.string().optional(),
});

// Types
export type GenerateICInvoiceInput = z.infer<typeof generateICInvoiceSchema>;
export type ApproveICInvoiceInput = z.infer<typeof approveICInvoiceSchema>;

export interface ICInvoice {
  id: string;
  invoiceNumber: string;
  providerEntityId: string;
  receiverEntityId: string;
  serviceAgreementId: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  lineItems: Array<{
    serviceCode: string;
    description: string;
    quantity: number;
    unitCost: number;
    markupPercent: number;
    costAmount: number;
    markupAmount: number;
    totalAmount: number;
  }>;
  subtotal: number;
  markupTotal: number;
  invoiceTotal: number;
  currency: string;
  status: 'draft' | 'pending-approval' | 'approved' | 'rejected' | 'posted';
  generatedDate: string;
  approvedDate: string | null;
  postedDate: string | null;
}

/**
 * Generate intercompany invoice based on service agreement.
 *
 * Calculates costs + transfer pricing markup, creates invoice for approval.
 *
 * @param input - IC invoice details with line items
 * @returns Generated IC invoice
 *
 * @example
 * ```typescript
 * const invoice = await generateICInvoice({
 *   providerEntityId: 'us-sharedservices',
 *   receiverEntityId: 'uk-subsidiary',
 *   serviceAgreementId: 'agreement-123',
 *   billingPeriodStart: '2024-01-01T00:00:00Z',
 *   billingPeriodEnd: '2024-01-31T00:00:00Z',
 *   lineItems: [
 *     {
 *       serviceCode: 'IT-001',
 *       description: 'IT Infrastructure Support - Jan 2024',
 *       quantity: 100, // 100 users
 *       unitCost: 100, // $100 per user
 *       markupPercent: 8, // 8% markup
 *     },
 *   ],
 *   currency: 'USD',
 * });
 * // Invoice: $10,000 cost + $800 markup = $10,800 total
 * ```
 */
export async function generateICInvoice(
  input: GenerateICInvoiceInput
): Promise<ICInvoice> {
  const validated = generateICInvoiceSchema.parse(input);

  // TODO: Implement IC invoice generation:
  // 1. Validate service agreement exists and is active
  // 2. Validate provider and receiver entities match agreement
  // 3. For each line item:
  //    a. Validate serviceCode exists in catalog
  //    b. Calculate costAmount = quantity × unitCost
  //    c. Calculate markupAmount = costAmount × (markupPercent / 100)
  //    d. Calculate totalAmount = costAmount + markupAmount
  // 4. Calculate invoice totals
  // 5. Generate invoice number (format: IC-YYYY-NNNN)
  // 6. Store in ic_invoices table (status: draft)
  // 7. Create approval workflow:
  //    - Receiver entity controller reviews (cost accuracy)
  //    - Provider entity controller approves (markup compliance)
  // 8. Generate invoice PDF with transfer pricing documentation
  // 9. Set reminder for approval SLA (typically 5 business days)

  const lineItemsWithTotals = validated.lineItems.map(item => {
    const costAmount = item.quantity * item.unitCost;
    const markupAmount = costAmount * (item.markupPercent / 100);
    const totalAmount = costAmount + markupAmount;

    return {
      ...item,
      costAmount,
      markupAmount,
      totalAmount,
    };
  });

  const subtotal = lineItemsWithTotals.reduce((sum, item) => sum + item.costAmount, 0);
  const markupTotal = lineItemsWithTotals.reduce((sum, item) => sum + item.markupAmount, 0);
  const invoiceTotal = subtotal + markupTotal;

  return {
    id: 'invoice-uuid',
    invoiceNumber: 'IC-2024-0001',
    providerEntityId: validated.providerEntityId,
    receiverEntityId: validated.receiverEntityId,
    serviceAgreementId: validated.serviceAgreementId,
    billingPeriodStart: validated.billingPeriodStart,
    billingPeriodEnd: validated.billingPeriodEnd,
    lineItems: lineItemsWithTotals,
    subtotal,
    markupTotal,
    invoiceTotal,
    currency: validated.currency,
    status: 'pending-approval',
    generatedDate: new Date().toISOString(),
    approvedDate: null,
    postedDate: null,
  };
}

/**
 * Approve intercompany invoice for posting.
 *
 * Records approval decision and triggers accounting entries in both entities.
 *
 * @param input - Invoice approval details
 * @returns Approved IC invoice
 *
 * @example
 * ```typescript
 * const approved = await approveICInvoice({
 *   invoiceId: 'invoice-123',
 *   approverUserId: 'user-456',
 *   approvalNotes: 'Costs validated against shared services allocation',
 * });
 * // Triggers:
 * // Provider: DR IC Receivable / CR IC Revenue
 * // Receiver: DR IC Expense / CR IC Payable
 * ```
 */
export async function approveICInvoice(
  input: ApproveICInvoiceInput
): Promise<ICInvoice> {
  const validated = approveICInvoiceSchema.parse(input);

  // TODO: Implement IC invoice approval:
  // 1. Validate invoice exists and status = pending-approval
  // 2. Validate approver has authority (delegation of authority check)
  // 3. Update invoice status to approved
  // 4. Record approver and approval date
  // 5. Create accounting entries in both entities:
  //    Provider entity:
  //      DR IC Receivable (BS)     $10,800
  //      CR IC Revenue (IS)        $10,800
  //    Receiver entity:
  //      DR IC Expense (IS)        $10,800
  //      CR IC Payable (BS)        $10,800
  // 6. Create IC matching record for reconciliation
  // 7. Update invoice status to posted
  // 8. Send notification to both entities (invoice posted, payment due)
  // 9. Add to elimination preparation queue (for consolidation)

  return {
    id: validated.invoiceId,
    invoiceNumber: 'IC-2024-0001',
    providerEntityId: 'us-sharedservices',
    receiverEntityId: 'uk-subsidiary',
    serviceAgreementId: 'agreement-123',
    billingPeriodStart: '2024-01-01T00:00:00Z',
    billingPeriodEnd: '2024-01-31T00:00:00Z',
    lineItems: [],
    subtotal: 10000,
    markupTotal: 800,
    invoiceTotal: 10800,
    currency: 'USD',
    status: 'approved',
    generatedDate: '2024-02-01T00:00:00Z',
    approvedDate: new Date().toISOString(),
    postedDate: new Date().toISOString(),
  };
}
