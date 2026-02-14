// TanStack Query hooks for Bank Transaction
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BankTransaction } from '../types/bank-transaction.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BankTransactionListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Bank Transaction records.
 */
export function useBankTransactionList(
  params: BankTransactionListParams = {},
  options?: Omit<UseQueryOptions<BankTransaction[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.bankTransaction.list(params),
    queryFn: () => apiGet<BankTransaction[]>(`/bank-transaction${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Bank Transaction by ID.
 */
export function useBankTransaction(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BankTransaction | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.bankTransaction.detail(id ?? ''),
    queryFn: () => apiGet<BankTransaction | null>(`/bank-transaction/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Bank Transaction.
 * Automatically invalidates list queries on success.
 */
export function useCreateBankTransaction(
  options?: UseMutationOptions<BankTransaction, Error, Partial<BankTransaction>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BankTransaction>) => apiPost<BankTransaction>('/bank-transaction', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankTransaction.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Bank Transaction.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBankTransaction(
  options?: UseMutationOptions<BankTransaction, Error, { id: string; data: Partial<BankTransaction> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BankTransaction> }) =>
      apiPut<BankTransaction>(`/bank-transaction/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankTransaction.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bankTransaction.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Bank Transaction by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBankTransaction(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/bank-transaction/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankTransaction.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Bank Transaction (set docstatus = 1).
 */
export function useSubmitBankTransaction(
  options?: UseMutationOptions<BankTransaction, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<BankTransaction>(`/bank-transaction/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankTransaction.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bankTransaction.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Bank Transaction (set docstatus = 2).
 */
export function useCancelBankTransaction(
  options?: UseMutationOptions<BankTransaction, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<BankTransaction>(`/bank-transaction/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankTransaction.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bankTransaction.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
