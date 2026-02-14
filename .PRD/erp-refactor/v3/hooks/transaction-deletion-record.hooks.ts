// TanStack Query hooks for Transaction Deletion Record
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { TransactionDeletionRecord } from '../types/transaction-deletion-record.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface TransactionDeletionRecordListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Transaction Deletion Record records.
 */
export function useTransactionDeletionRecordList(
  params: TransactionDeletionRecordListParams = {},
  options?: Omit<UseQueryOptions<TransactionDeletionRecord[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.transactionDeletionRecord.list(params),
    queryFn: () => apiGet<TransactionDeletionRecord[]>(`/transaction-deletion-record${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Transaction Deletion Record by ID.
 */
export function useTransactionDeletionRecord(
  id: string | undefined,
  options?: Omit<UseQueryOptions<TransactionDeletionRecord | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.transactionDeletionRecord.detail(id ?? ''),
    queryFn: () => apiGet<TransactionDeletionRecord | null>(`/transaction-deletion-record/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Transaction Deletion Record.
 * Automatically invalidates list queries on success.
 */
export function useCreateTransactionDeletionRecord(
  options?: UseMutationOptions<TransactionDeletionRecord, Error, Partial<TransactionDeletionRecord>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<TransactionDeletionRecord>) => apiPost<TransactionDeletionRecord>('/transaction-deletion-record', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactionDeletionRecord.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Transaction Deletion Record.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateTransactionDeletionRecord(
  options?: UseMutationOptions<TransactionDeletionRecord, Error, { id: string; data: Partial<TransactionDeletionRecord> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TransactionDeletionRecord> }) =>
      apiPut<TransactionDeletionRecord>(`/transaction-deletion-record/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactionDeletionRecord.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactionDeletionRecord.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Transaction Deletion Record by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteTransactionDeletionRecord(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/transaction-deletion-record/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactionDeletionRecord.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Transaction Deletion Record (set docstatus = 1).
 */
export function useSubmitTransactionDeletionRecord(
  options?: UseMutationOptions<TransactionDeletionRecord, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<TransactionDeletionRecord>(`/transaction-deletion-record/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactionDeletionRecord.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactionDeletionRecord.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Transaction Deletion Record (set docstatus = 2).
 */
export function useCancelTransactionDeletionRecord(
  options?: UseMutationOptions<TransactionDeletionRecord, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<TransactionDeletionRecord>(`/transaction-deletion-record/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactionDeletionRecord.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactionDeletionRecord.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
