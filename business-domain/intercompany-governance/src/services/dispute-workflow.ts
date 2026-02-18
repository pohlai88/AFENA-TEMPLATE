/**
 * Dispute Workflow Service
 *
 * Manages intercompany reconciliation disputes with SLA tracking and resolution workflows.
 */

import { z } from 'zod';

// Schemas
export const createDisputeSchema = z.object({
  entityId: z.string().uuid(),
  counterpartyEntityId: z.string().uuid(),
  transactionId: z.string().uuid().optional(),
  disputeType: z.enum(['amount-mismatch', 'missing-transaction', 'duplicate', 'timing-difference', 'fx-rate', 'allocation']),
  description: z.string().min(1),
  disputedAmount: z.number(),
  currency: z.string().length(3),
  supportingDocuments: z.array(z.object({
    fileName: z.string(),
    fileUrl: z.string().url(),
  })).optional(),
});

export const resolveDisputeSchema = z.object({
  disputeId: z.string().uuid(),
  resolutionType: z.enum(['accepted', 'rejected', 'adjusted', 'split-difference']),
  resolutionNotes: z.string(),
  adjustmentAmount: z.number().optional(),
  adjustmentJournalId: z.string().uuid().optional(),
  resolvedByUserId: z.string().uuid(),
});

// Types
export type CreateDisputeInput = z.infer<typeof createDisputeSchema>;
export type ResolveDisputeInput = z.infer<typeof resolveDisputeSchema>;

export interface ICDispute {
  id: string;
  disputeNumber: string;
  entityId: string;
  counterpartyEntityId: string;
  transactionId: string | null;
  disputeType: string;
  description: string;
  disputedAmount: number;
  currency: string;
  status: 'open' | 'in-review' | 'escalated' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdDate: string;
  dueDate: string; // SLA deadline
  resolvedDate: string | null;
  resolutionType: string | null;
  resolutionNotes: string | null;
  slaStatus: 'on-time' | 'at-risk' | 'breached';
  supportingDocuments: Array<{
    fileName: string;
    fileUrl: string;
  }>;
}

export interface DisputeResolution {
  disputeId: string;
  resolutionType: string;
  resolutionNotes: string;
  adjustmentAmount: number | null;
  adjustmentJournalId: string | null;
  resolvedByUserId: string;
  resolvedDate: string;
  cycleTime: number; // Days to resolve
  slaCompliant: boolean;
}

/**
 * Create intercompany reconciliation dispute.
 *
 * Initiates dispute workflow with SLA tracking and assignment to counterparty.
 *
 * @param input - Dispute details
 * @returns Created dispute record
 *
 * @example
 * ```typescript
 * const dispute = await createDispute({
 *   entityId: 'uk-sub',
 *   counterpartyEntityId: 'us-parent',
 *   disputeType: 'amount-mismatch',
 *   description: 'IC invoice #IC-2024-0001: UK sub recorded $10,800 payable but US parent shows $11,000 receivable',
 *   disputedAmount: 200,
 *   currency: 'USD',
 *   supportingDocuments: [
 *     { fileName: 'uk-ledger-extract.pdf', fileUrl: 'https://...' },
 *   ],
 * });
 * // SLA: 10 business days to resolve
 * ```
 */
export async function createDispute(
  input: CreateDisputeInput
): Promise<ICDispute> {
  const validated = createDisputeSchema.parse(input);

  // TODO: Implement dispute creation:
  // 1. Validate entity and counterparty entities exist
  // 2. Validate transaction exists (if transactionId provided)
  // 3. Generate dispute number (format: DISP-YYYY-NNNN)
  // 4. Calculate priority based on amount:
  //    - Critical: >$100k
  //    - High: $25k-100k
  //    - Medium: $5k-25k
  //    - Low: <$5k
  // 5. Calculate SLA due date based on priority:
  //    - Critical: 3 business days
  //    - High: 5 business days
  //    - Medium: 10 business days
  //    - Low: 15 business days
  // 6. Assign to counterparty entity controller
  // 7. Send notification to both entities
  // 8. Create dispute queue entry
  // 9. Store supporting documents in secure vault
  // 10. Create audit trail entry

  const createdDate = new Date();
  const dueDate = new Date(createdDate);
  dueDate.setDate(dueDate.getDate() + 10); // 10 business days

  return {
    id: 'dispute-uuid',
    disputeNumber: 'DISP-2024-0001',
    entityId: validated.entityId,
    counterpartyEntityId: validated.counterpartyEntityId,
    transactionId: validated.transactionId || null,
    disputeType: validated.disputeType,
    description: validated.description,
    disputedAmount: validated.disputedAmount,
    currency: validated.currency,
    status: 'open',
    priority: validated.disputedAmount > 100000 ? 'critical' : validated.disputedAmount > 25000 ? 'high' : validated.disputedAmount > 5000 ? 'medium' : 'low',
    createdDate: createdDate.toISOString(),
    dueDate: dueDate.toISOString(),
    resolvedDate: null,
    resolutionType: null,
    resolutionNotes: null,
    slaStatus: 'on-time',
    supportingDocuments: validated.supportingDocuments || [],
  };
}

/**
 * Resolve intercompany dispute.
 *
 * Records resolution decision and creates adjustment entries if needed.
 *
 * @param input - Resolution details
 * @returns Dispute resolution record
 *
 * @example
 * ```typescript
 * const resolution = await resolveDispute({
 *   disputeId: 'dispute-123',
 *   resolutionType: 'adjusted',
 *   resolutionNotes: 'UK sub had incorrect FX rate. Adjusted payable to $11,000.',
 *   adjustmentAmount: 200,
 *   adjustmentJournalId: 'je-456',
 *   resolvedByUserId: 'user-789',
 * });
 * // Resolution types:
 * // - accepted: Counterparty acknowledges error, adjusts their books
 * // - rejected: Dispute invalid, no adjustment needed
 * // - adjusted: Create adjustment journal entry
 * // - split-difference: Both entities adjust 50%
 * ```
 */
export async function resolveDispute(
  input: ResolveDisputeInput
): Promise<DisputeResolution> {
  const validated = resolveDisputeSchema.parse(input);

  // TODO: Implement dispute resolution:
  // 1. Validate dispute exists and status = open or in-review
  // 2. Validate resolver has authority (entity controller or above)
  // 3. Apply resolution type:
  //    - Accepted: Counterparty adjusts their books
  //    - Rejected: Dispute invalid, close without adjustment
  //    - Adjusted: Create adjustment journal entry in disputing entity
  //    - Split-difference: Create adjustment in both entities (50/50 split)
  // 4. Create adjustment journal entries:
  //    - Amount mismatch: Adjust AR/AP by difference
  //    - Missing transaction: Create transaction in missing entity
  //    - Duplicate: Reverse duplicate transaction
  //    - Timing difference: Reclassify to prepaid/accrual
  // 5. Update dispute status to resolved
  // 6. Calculate cycle time (createdDate → resolvedDate)
  // 7. Check SLA compliance (resolvedDate <= dueDate)
  // 8. Send resolution notification to both entities
  // 9. Create audit trail with resolution details
  // 10. Update reconciliation status (if all disputes resolved → reconciled)

  const resolvedDate = new Date();
  const createdDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000); // 5 days ago (example)
  const cycleTime = Math.floor((resolvedDate.getTime() - createdDate.getTime()) / (24 * 60 * 60 * 1000));
  const dueDate = new Date(createdDate);
  dueDate.setDate(dueDate.getDate() + 10);
  const slaCompliant = resolvedDate <= dueDate;

  return {
    disputeId: validated.disputeId,
    resolutionType: validated.resolutionType,
    resolutionNotes: validated.resolutionNotes,
    adjustmentAmount: validated.adjustmentAmount || null,
    adjustmentJournalId: validated.adjustmentJournalId || null,
    resolvedByUserId: validated.resolvedByUserId,
    resolvedDate: resolvedDate.toISOString(),
    cycleTime,
    slaCompliant,
  };
}
