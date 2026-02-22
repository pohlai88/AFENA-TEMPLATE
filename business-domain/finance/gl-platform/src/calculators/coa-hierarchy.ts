/**
 * @see GL-01 — Multi-entity chart of accounts with hierarchical structure
 * @see GL-02 — CoA integrity validation (no cycles, all parents exist)
 * @see GL-10 — Dimension validation on journal lines
 *
 * Chart of Accounts Hierarchy Traversal
 *
 * Computes ancestor chains, descendant subtrees, and validates CoA integrity
 * (e.g. no cycles, all parents exist, leaves are postable).
 */
import { DomainError } from 'afenda-canon';

export type AccountNode = {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  parentAccountId: string | null;
  isPostable: boolean;
  normalBalance: 'debit' | 'credit';
};

export type CoaTreeResult = {
  result: AccountNode[];
  inputs: { rootId: string | null; accounts: readonly AccountNode[] };
  explanation: string;
};

/**
 * Returns the subtree of accounts under `rootId` (depth-first).
 * If `rootId` is null, returns all root-level accounts and their subtrees.
 */
export function getSubtree(rootId: string | null, accounts: readonly AccountNode[]): CoaTreeResult {
  const childMap = new Map<string | null, AccountNode[]>();
  for (const a of accounts) {
    const key = a.parentAccountId;
    const list = childMap.get(key) ?? [];
    list.push(a);
    childMap.set(key, list);
  }

  const result: AccountNode[] = [];
  const stack = [...(childMap.get(rootId) ?? [])];

  while (stack.length > 0) {
    const node = stack.pop()!;
    result.push(node);
    const children = childMap.get(node.id) ?? [];
    stack.push(...children.reverse());
  }

  return {
    result,
    inputs: { rootId, accounts },
    explanation: `Subtree from ${rootId ?? 'root'}: ${result.length} account(s) found.`,
  };
}

/**
 * Returns the ancestor chain for a given account (from leaf up to root).
 */
export function getAncestors(accountId: string, accounts: readonly AccountNode[]): AccountNode[] {
  const byId = new Map(accounts.map((a) => [a.id, a]));
  const chain: AccountNode[] = [];
  let current = byId.get(accountId);
  const visited = new Set<string>();

  while (current) {
    if (visited.has(current.id)) {
      throw new DomainError(
        'VALIDATION_FAILED',
        `Cycle detected in CoA hierarchy at account ${current.accountCode}`,
        { accountId: current.id },
      );
    }
    visited.add(current.id);
    chain.push(current);
    current = current.parentAccountId ? byId.get(current.parentAccountId) : undefined;
  }

  return chain;
}

/**
 * Validates CoA integrity: no cycles, all parents exist, root nodes have no parent.
 */
export function validateCoaIntegrity(accounts: readonly AccountNode[]): {
  valid: boolean;
  explanation: string;
} {
  const byId = new Set(accounts.map((a) => a.id));

  for (const a of accounts) {
    if (a.parentAccountId && !byId.has(a.parentAccountId)) {
      throw new DomainError(
        'VALIDATION_FAILED',
        `Account ${a.accountCode} references non-existent parent ${a.parentAccountId}`,
        { accountId: a.id, parentAccountId: a.parentAccountId },
      );
    }
  }

  // Check for cycles by walking each node
  for (const a of accounts) {
    getAncestors(a.id, accounts);
  }

  return {
    valid: true,
    explanation: `CoA integrity validated: ${accounts.length} accounts, no cycles, all parents exist.`,
  };
}
