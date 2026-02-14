// TanStack Query hooks for Transaction Deletion Record Details
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { TransactionDeletionRecordDetails } from '../types/transaction-deletion-record-details.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface TransactionDeletionRecordDetailsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Transaction Deletion Record Details records.
 */
export function useTransactionDeletionRecordDetailsList(
  params: TransactionDeletionRecordDetailsListParams = {},
  options?: Omit<UseQueryOptions<TransactionDeletionRecordDetails[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.transactionDeletionRecordDetails.list(params),
    queryFn: () => apiGet<TransactionDeletionRecordDetails[]>(`/transaction-deletion-record-details${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Transaction Deletion Record Details by ID.
 */
export function useTransactionDeletionRecordDetails(
  id: string | undefined,
  options?: Omit<UseQueryOptions<TransactionDeletionRecordDetails | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.transactionDeletionRecordDetails.detail(id ?? ''),
    queryFn: () => apiGet<TransactionDeletionRecordDetails | null>(`/transaction-deletion-record-details/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Transaction Deletion Record Details.
 * Automatically invalidates list queries on success.
 */
export function useCreateTransactionDeletionRecordDetails(
  options?: UseMutationOptions<TransactionDeletionRecordDetails, Error, Partial<TransactionDeletionRecordDetails>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<TransactionDeletionRecordDetails>) => apiPost<TransactionDeletionRecordDetails>('/transaction-deletion-record-details', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactionDeletionRecordDetails.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Transaction Deletion Record Details.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateTransactionDeletionRecordDetails(
  options?: UseMutationOptions<TransactionDeletionRecordDetails, Error, { id: string; data: Partial<TransactionDeletionRecordDetails> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TransactionDeletionRecordDetails> }) =>
      apiPut<TransactionDeletionRecordDetails>(`/transaction-deletion-record-details/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactionDeletionRecordDetails.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactionDeletionRecordDetails.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Transaction Deletion Record Details by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteTransactionDeletionRecordDetails(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/transaction-deletion-record-details/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactionDeletionRecordDetails.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
