// TanStack Query hooks for Ledger Merge Accounts
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { LedgerMergeAccounts } from '../types/ledger-merge-accounts.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface LedgerMergeAccountsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Ledger Merge Accounts records.
 */
export function useLedgerMergeAccountsList(
  params: LedgerMergeAccountsListParams = {},
  options?: Omit<UseQueryOptions<LedgerMergeAccounts[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.ledgerMergeAccounts.list(params),
    queryFn: () => apiGet<LedgerMergeAccounts[]>(`/ledger-merge-accounts${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Ledger Merge Accounts by ID.
 */
export function useLedgerMergeAccounts(
  id: string | undefined,
  options?: Omit<UseQueryOptions<LedgerMergeAccounts | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.ledgerMergeAccounts.detail(id ?? ''),
    queryFn: () => apiGet<LedgerMergeAccounts | null>(`/ledger-merge-accounts/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Ledger Merge Accounts.
 * Automatically invalidates list queries on success.
 */
export function useCreateLedgerMergeAccounts(
  options?: UseMutationOptions<LedgerMergeAccounts, Error, Partial<LedgerMergeAccounts>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<LedgerMergeAccounts>) => apiPost<LedgerMergeAccounts>('/ledger-merge-accounts', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ledgerMergeAccounts.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Ledger Merge Accounts.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateLedgerMergeAccounts(
  options?: UseMutationOptions<LedgerMergeAccounts, Error, { id: string; data: Partial<LedgerMergeAccounts> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LedgerMergeAccounts> }) =>
      apiPut<LedgerMergeAccounts>(`/ledger-merge-accounts/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ledgerMergeAccounts.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.ledgerMergeAccounts.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Ledger Merge Accounts by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteLedgerMergeAccounts(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/ledger-merge-accounts/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ledgerMergeAccounts.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
