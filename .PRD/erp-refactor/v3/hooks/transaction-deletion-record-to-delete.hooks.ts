// TanStack Query hooks for Transaction Deletion Record To Delete
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { TransactionDeletionRecordToDelete } from '../types/transaction-deletion-record-to-delete.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface TransactionDeletionRecordToDeleteListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Transaction Deletion Record To Delete records.
 */
export function useTransactionDeletionRecordToDeleteList(
  params: TransactionDeletionRecordToDeleteListParams = {},
  options?: Omit<UseQueryOptions<TransactionDeletionRecordToDelete[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.transactionDeletionRecordToDelete.list(params),
    queryFn: () => apiGet<TransactionDeletionRecordToDelete[]>(`/transaction-deletion-record-to-delete${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Transaction Deletion Record To Delete by ID.
 */
export function useTransactionDeletionRecordToDelete(
  id: string | undefined,
  options?: Omit<UseQueryOptions<TransactionDeletionRecordToDelete | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.transactionDeletionRecordToDelete.detail(id ?? ''),
    queryFn: () => apiGet<TransactionDeletionRecordToDelete | null>(`/transaction-deletion-record-to-delete/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Transaction Deletion Record To Delete.
 * Automatically invalidates list queries on success.
 */
export function useCreateTransactionDeletionRecordToDelete(
  options?: UseMutationOptions<TransactionDeletionRecordToDelete, Error, Partial<TransactionDeletionRecordToDelete>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<TransactionDeletionRecordToDelete>) => apiPost<TransactionDeletionRecordToDelete>('/transaction-deletion-record-to-delete', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactionDeletionRecordToDelete.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Transaction Deletion Record To Delete.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateTransactionDeletionRecordToDelete(
  options?: UseMutationOptions<TransactionDeletionRecordToDelete, Error, { id: string; data: Partial<TransactionDeletionRecordToDelete> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TransactionDeletionRecordToDelete> }) =>
      apiPut<TransactionDeletionRecordToDelete>(`/transaction-deletion-record-to-delete/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactionDeletionRecordToDelete.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactionDeletionRecordToDelete.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Transaction Deletion Record To Delete by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteTransactionDeletionRecordToDelete(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/transaction-deletion-record-to-delete/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactionDeletionRecordToDelete.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
