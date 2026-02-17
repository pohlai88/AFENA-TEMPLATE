import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const GenerateLeaseEntriesParams = z.object({
  leaseId: z.string(),
  periodEndDate: z.date(),
  entryType: z.enum([
    'initial_recognition',
    'periodic_payment',
    'depreciation',
    'interest',
    'modification',
  ]),
});

export interface LeaseJournalEntry {
  entryId: string;
  leaseId: string;
  entryType: string;
  periodEndDate: Date;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  description: string;
  posted: boolean;
  postedAt?: Date;
}

export interface LeaseEntries {
  leaseId: string;
  periodEndDate: Date;
  entries: LeaseJournalEntry[];
  totalDebits: number;
  totalCredits: number;
  balanced: boolean;
  generatedAt: Date;
}

export async function generateLeaseEntries(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof GenerateLeaseEntriesParams>,
): Promise<Result<LeaseEntries>> {
  const validated = GenerateLeaseEntriesParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Generate appropriate journal entries based on entry type
  const entries: LeaseJournalEntry[] = [];

  if (validated.data.entryType === 'initial_recognition') {
    entries.push({
      entryId: `je-${Date.now()}-1`,
      leaseId: validated.data.leaseId,
      entryType: 'initial_recognition',
      periodEndDate: validated.data.periodEndDate,
      debitAccount: '1600-ROU-ASSET',
      creditAccount: '2400-LEASE-LIABILITY',
      amount: 0,
      description: 'Initial lease recognition',
      posted: false,
    });
  }

  if (validated.data.entryType === 'periodic_payment') {
    entries.push(
      {
        entryId: `je-${Date.now()}-1`,
        leaseId: validated.data.leaseId,
        entryType: 'periodic_payment',
        periodEndDate: validated.data.periodEndDate,
        debitAccount: '2400-LEASE-LIABILITY',
        creditAccount: '1000-CASH',
        amount: 0,
        description: 'Lease payment - principal',
        posted: false,
      },
      {
        entryId: `je-${Date.now()}-2`,
        leaseId: validated.data.leaseId,
        entryType: 'interest',
        periodEndDate: validated.data.periodEndDate,
        debitAccount: '7200-INTEREST-EXPENSE',
        creditAccount: '1000-CASH',
        amount: 0,
        description: 'Lease payment - interest',
        posted: false,
      },
    );
  }

  const totalDebits = entries.reduce((sum, e) => (e.debitAccount ? sum + e.amount : sum), 0);
  const totalCredits = entries.reduce((sum, e) => (e.creditAccount ? sum + e.amount : sum), 0);

  return ok({
    leaseId: validated.data.leaseId,
    periodEndDate: validated.data.periodEndDate,
    entries,
    totalDebits,
    totalCredits,
    balanced: Math.abs(totalDebits - totalCredits) < 0.01,
    generatedAt: new Date(),
  });
}

const PostLeaseJournalsParams = z.object({
  entryIds: z.array(z.string()),
  postingDate: z.date(),
  glPeriod: z.string(),
});

export interface PostingResult {
  successfulEntries: string[];
  failedEntries: { entryId: string; reason: string }[];
  totalPosted: number;
  totalFailed: number;
  postingDate: Date;
  glPeriod: string;
}

export async function postLeaseJournals(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof PostLeaseJournalsParams>,
): Promise<Result<PostingResult>> {
  const validated = PostLeaseJournalsParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Post journal entries to GL
  const successfulEntries: string[] = [];
  const failedEntries: { entryId: string; reason: string }[] = [];

  for (const entryId of validated.data.entryIds) {
    // TODO: Validate and post entry
    successfulEntries.push(entryId);
  }

  return ok({
    successfulEntries,
    failedEntries,
    totalPosted: successfulEntries.length,
    totalFailed: failedEntries.length,
    postingDate: validated.data.postingDate,
    glPeriod: validated.data.glPeriod,
  });
}

const ReverseLeaseEntryParams = z.object({
  entryId: z.string(),
  reversalDate: z.date(),
  reason: z.string(),
});

export interface ReversalResult {
  originalEntryId: string;
  reversalEntryId: string;
  reversalDate: Date;
  reason: string;
  reversalEntries: LeaseJournalEntry[];
  posted: boolean;
}

export async function reverseLeaseEntry(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof ReverseLeaseEntryParams>,
): Promise<Result<ReversalResult>> {
  const validated = ReverseLeaseEntryParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Create reversal entries
  return ok({
    originalEntryId: validated.data.entryId,
    reversalEntryId: `rev-${Date.now()}`,
    reversalDate: validated.data.reversalDate,
    reason: validated.data.reason,
    reversalEntries: [],
    posted: false,
  });
}

const GetLeaseJournalsParams = z.object({
  leaseId: z.string(),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
  entryType: z
    .enum([
      'initial_recognition',
      'periodic_payment',
      'depreciation',
      'interest',
      'modification',
      'all',
    ])
    .optional(),
  posted: z.boolean().optional(),
});

export interface LeaseJournalSummary {
  leaseId: string;
  totalEntries: number;
  postedEntries: number;
  unpostedEntries: number;
  totalDebits: number;
  totalCredits: number;
  entries: LeaseJournalEntry[];
}

export async function getLeaseJournals(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof GetLeaseJournalsParams>,
): Promise<Result<LeaseJournalSummary>> {
  const validated = GetLeaseJournalsParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Query journal entries from DB
  return ok({
    leaseId: validated.data.leaseId,
    totalEntries: 0,
    postedEntries: 0,
    unpostedEntries: 0,
    totalDebits: 0,
    totalCredits: 0,
    entries: [],
  });
}
