/**
 * Collections Service
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface DunningWorkflow {
  workflowId: string;
  customerId: string;
  stage: 'reminder' | 'warning' | 'final_notice' | 'collections_agency';
  nextAction: string;
  nextActionDate: string;
}

export interface CollectionLetter {
  letterId: string;
  customerId: string;
  letterType: string;
  content: string;
}

export async function createDunningWorkflow(
  db: NeonHttpDatabase,
  orgId: string,
  params: { customerId: string; overdueInvoices: string[] },
): Promise<DunningWorkflow> {
  // TODO: Create dunning workflow based on overdue duration
  return {
    workflowId: `DUN-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    customerId: params.customerId,
    stage: 'reminder',
    nextAction: 'Send reminder email',
    nextActionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  };
}

export async function generateCollectionLetter(
  db: NeonHttpDatabase,
  orgId: string,
  params: { customerId: string; letterType: 'reminder' | 'warning' | 'final' },
): Promise<CollectionLetter> {
  // TODO: Generate collection letter
  return {
    letterId: `LTR-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    customerId: params.customerId,
    letterType: params.letterType,
    content: 'Dear Customer, your payment is overdue...',
  };
}
