// TanStack Query hooks for Bulk Transaction Log Detail
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BulkTransactionLogDetail } from '../types/bulk-transaction-log-detail.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BulkTransactionLogDetailListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Bulk Transaction Log Detail records.
 */
export function useBulkTransactionLogDetailList(
  params: BulkTransactionLogDetailListParams = {},
  options?: Omit<UseQueryOptions<BulkTransactionLogDetail[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.bulkTransactionLogDetail.list(params),
    queryFn: () => apiGet<BulkTransactionLogDetail[]>(`/bulk-transaction-log-detail${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Bulk Transaction Log Detail by ID.
 */
export function useBulkTransactionLogDetail(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BulkTransactionLogDetail | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.bulkTransactionLogDetail.detail(id ?? ''),
    queryFn: () => apiGet<BulkTransactionLogDetail | null>(`/bulk-transaction-log-detail/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Bulk Transaction Log Detail.
 * Automatically invalidates list queries on success.
 */
export function useCreateBulkTransactionLogDetail(
  options?: UseMutationOptions<BulkTransactionLogDetail, Error, Partial<BulkTransactionLogDetail>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BulkTransactionLogDetail>) => apiPost<BulkTransactionLogDetail>('/bulk-transaction-log-detail', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bulkTransactionLogDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Bulk Transaction Log Detail.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBulkTransactionLogDetail(
  options?: UseMutationOptions<BulkTransactionLogDetail, Error, { id: string; data: Partial<BulkTransactionLogDetail> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BulkTransactionLogDetail> }) =>
      apiPut<BulkTransactionLogDetail>(`/bulk-transaction-log-detail/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bulkTransactionLogDetail.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bulkTransactionLogDetail.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Bulk Transaction Log Detail by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBulkTransactionLogDetail(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/bulk-transaction-log-detail/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bulkTransactionLogDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
