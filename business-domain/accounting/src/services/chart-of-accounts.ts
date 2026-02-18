import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface ChartOfAccounts {
  id: string;
  orgId: string;
  accountNumber: string;
  accountName: string;
  accountType: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  accountSubType: string;
  parentAccountId?: string;
  isActive: boolean;
  balance: number;
  currency: string;
}

export function createAccount(
  _db: NeonHttpDatabase,
  _data: Omit<ChartOfAccounts, 'id' | 'balance'>,
): ChartOfAccounts {
  // TODO: Insert into database with zero balance
  throw new Error('Database integration pending');
}

export function getChartOfAccounts(
  _db: NeonHttpDatabase,
  _orgId: string,
  _activeOnly: boolean = true,
): ChartOfAccounts[] {
  // TODO: Query database
  throw new Error('Database integration pending');
}

export function updateAccountBalance(
  _db: NeonHttpDatabase,
  _accountId: string,
  _amount: number,
  _isDebit: boolean,
): ChartOfAccounts {
  // TODO: Update account balance based on account type and transaction type
  throw new Error('Database integration pending');
}

export function calculateNormalBalance(
  accountType: ChartOfAccounts['accountType'],
): 'DEBIT' | 'CREDIT' {
  const debitAccounts: ChartOfAccounts['accountType'][] = ['ASSET', 'EXPENSE'];
  return debitAccounts.includes(accountType) ? 'DEBIT' : 'CREDIT';
}

export function validateAccountNumber(
  accountNumber: string,
  format: 'NUMERIC' | 'ALPHANUMERIC' | 'HIERARCHICAL',
): {
  valid: boolean;
  error?: string;
} {
  if (format === 'NUMERIC') {
    const isNumeric = /^\d+$/.test(accountNumber);
    return isNumeric
      ? { valid: true }
      : { valid: false, error: 'Account number must be numeric' };
  }

  if (format === 'HIERARCHICAL') {
    const isValid = /^\d{4}-\d{2}-\d{2}$/.test(accountNumber);
    return isValid
      ? { valid: true }
      : { valid: false, error: 'Account number must follow format XXXX-XX-XX' };
  }

  return { valid: true };
}

export function buildAccountHierarchy(accounts: ChartOfAccounts[]): Array<ChartOfAccounts & { children: ChartOfAccounts[] }> {
  const accountMap = new Map<string, ChartOfAccounts & { children: ChartOfAccounts[] }>();
  const rootAccounts: Array<ChartOfAccounts & { children: ChartOfAccounts[] }> = [];

  // Create map with children arrays
  for (const account of accounts) {
    accountMap.set(account.id, { ...account, children: [] });
  }

  // Build hierarchy
  for (const account of accountMap.values()) {
    if (account.parentAccountId) {
      const parent = accountMap.get(account.parentAccountId);
      if (parent) {
        parent.children.push(account);
      }
    } else {
      rootAccounts.push(account);
    }
  }

  return rootAccounts;
}
