import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface JournalEntry {
  id: string;
  orgId: string;
  entryDate: Date;
  entryNumber: string;
  description: string;
  lines: Array<{
    accountId: string;
    debit: number;
    credit: number;
    description?: string;
    costCenter?: string;
    department?: string;
  }>;
  status: 'DRAFT' | 'POSTED' | 'REVERSED';
  postedBy?: string;
  postedAt?: Date;
  reversalOf?: string;
}

export function createJournalEntry(
  _db: NeonHttpDatabase,
  _data: Omit<JournalEntry, 'id' | 'status'>,
): JournalEntry {
  // TODO: Insert into database with DRAFT status
  throw new Error('Database integration pending');
}

export function postJournalEntry(
  _db: NeonHttpDatabase,
  _entryId: string,
  _userId: string,
): JournalEntry {
  // TODO: Update status to POSTED and update GL balances
  throw new Error('Database integration pending');
}

export function reverseJournalEntry(
  _db: NeonHttpDatabase,
  _entryId: string,
  _reversalDate: string,
  _userId: string,
): JournalEntry {
  // TODO: Create reversing entry and mark original as REVERSED
  throw new Error('Database integration pending');
}

export function validateJournalEntry(entry: JournalEntry): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check if entry has lines
  if (!entry.lines || entry.lines.length === 0) {
    errors.push('Journal entry must have at least one line');
  }

  // Check if debits equal credits
  const totalDebits = entry.lines.reduce((sum, line) => sum + line.debit, 0);
  const totalCredits = entry.lines.reduce((sum, line) => sum + line.credit, 0);

  if (Math.abs(totalDebits - totalCredits) > 0.01) {
    errors.push(`Entry is out of balance: Debits ${totalDebits} ≠ Credits ${totalCredits}`);
  }

  // Check for lines with both debit and credit
  const invalidLines = entry.lines.filter((line) => line.debit > 0 && line.credit > 0);
  if (invalidLines.length > 0) {
    errors.push('Journal entry lines cannot have both debit and credit amounts');
  }

  // Check for zero-amount lines
  const zeroLines = entry.lines.filter((line) => line.debit === 0 && line.credit === 0);
  if (zeroLines.length > 0) {
    errors.push('Journal entry lines must have a debit or credit amount');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function generateEntryNumber(
  orgId: string,
  entryDate: Date,
  sequence: number,
): string {
  const year = entryDate.getFullYear();
  const month = (entryDate.getMonth() + 1).toString().padStart(2, '0');
  return `JE-${orgId}-${year}${month}-${sequence.toString().padStart(5, '0')}`;
}
