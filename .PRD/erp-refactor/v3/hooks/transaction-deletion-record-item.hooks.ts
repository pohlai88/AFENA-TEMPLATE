// TanStack Query hooks for Transaction Deletion Record Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { TransactionDeletionRecordItem } from '../types/transaction-deletion-record-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface TransactionDeletionRecordItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Transaction Deletion Record Item records.
 */
export function useTransactionDeletionRecordItemList(
  params: TransactionDeletionRecordItemListParams = {},
  options?: Omit<UseQueryOptions<TransactionDeletionRecordItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.transactionDeletionRecordItem.list(params),
    queryFn: () => apiGet<TransactionDeletionRecordItem[]>(`/transaction-deletion-record-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Transaction Deletion Record Item by ID.
 */
export function useTransactionDeletionRecordItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<TransactionDeletionRecordItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.transactionDeletionRecordItem.detail(id ?? ''),
    queryFn: () => apiGet<TransactionDeletionRecordItem | null>(`/transaction-deletion-record-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Transaction Deletion Record Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateTransactionDeletionRecordItem(
  options?: UseMutationOptions<TransactionDeletionRecordItem, Error, Partial<TransactionDeletionRecordItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<TransactionDeletionRecordItem>) => apiPost<TransactionDeletionRecordItem>('/transaction-deletion-record-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactionDeletionRecordItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Transaction Deletion Record Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateTransactionDeletionRecordItem(
  options?: UseMutationOptions<TransactionDeletionRecordItem, Error, { id: string; data: Partial<TransactionDeletionRecordItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TransactionDeletionRecordItem> }) =>
      apiPut<TransactionDeletionRecordItem>(`/transaction-deletion-record-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactionDeletionRecordItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactionDeletionRecordItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Transaction Deletion Record Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteTransactionDeletionRecordItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/transaction-deletion-record-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactionDeletionRecordItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
