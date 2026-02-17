/**
 * Invoice Approval Service
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface ApprovalParams {
  invoiceId: string;
  approverId: string;
  checkBudget?: boolean;
}

export interface ApprovalResult {
  invoiceId: string;
  status: 'approved' | 'rejected' | 'pending' | 'pending_budget';
  nextApprover?: string;
  requiresAdditionalApproval: boolean;
}

export interface DiscountCalculation {
  invoiceId: string;
  eligibleForDiscount: boolean;
  discountPct: number;
  discountAmount: number;
  discountDeadline: string;
  netPaymentIfDiscounted: number;
}

export async function submitForApproval(
  db: NeonHttpDatabase,
  orgId: string,
  params: ApprovalParams,
): Promise<ApprovalResult> {
  // TODO: Determine approval workflow based on amount/vendor/GL account
  // TODO: Check budget availability
  // TODO: Route to approver
  
  return {
    invoiceId: params.invoiceId,
    status: 'pending',
    nextApprover: params.approverId,
    requiresAdditionalApproval: false,
  };
}

export async function approveInvoice(
  db: NeonHttpDatabase,
  orgId: string,
  params: {
    invoiceId: string;
    approverId: string;
    decision: 'approve' | 'reject';
    comments?: string;
  },
): Promise<ApprovalResult> {
  // TODO: Update approval record
  // TODO: Move to next approver if multi-level
  // TODO: Schedule for payment if fully approved
  
  return {
    invoiceId: params.invoiceId,
    status: params.decision === 'approve' ? 'approved' : 'rejected',
    requiresAdditionalApproval: false,
  };
}

export async function calculateEarlyPaymentDiscount(
  db: NeonHttpDatabase,
  orgId: string,
  params: {
    invoiceId: string;
    proposedPaymentDate: string;
  },
): Promise<DiscountCalculation> {
  // TODO: Parse payment terms (e.g., "2/10 Net 30")
  // TODO: Calculate discount deadline
  // TODO: Calculate discount amount
  
  const discountPct = 0.02;
  const grossAmount = 5000.00;
  const discountAmount = grossAmount * discountPct;
  
  return {
    invoiceId: params.invoiceId,
    eligibleForDiscount: true,
    discountPct,
    discountAmount,
    discountDeadline: '2025-01-25',
    netPaymentIfDiscounted: grossAmount - discountAmount,
  };
}
