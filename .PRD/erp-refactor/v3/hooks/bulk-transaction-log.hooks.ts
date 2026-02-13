// TanStack Query hooks for Bulk Transaction Log
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BulkTransactionLog } from '../types/bulk-transaction-log.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BulkTransactionLogListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Bulk Transaction Log records.
 */
export function useBulkTransactionLogList(
  params: BulkTransactionLogListParams = {},
  options?: Omit<UseQueryOptions<BulkTransactionLog[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.bulkTransactionLog.list(params),
    queryFn: () => apiGet<BulkTransactionLog[]>(`/bulk-transaction-log${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Bulk Transaction Log by ID.
 */
export function useBulkTransactionLog(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BulkTransactionLog | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.bulkTransactionLog.detail(id ?? ''),
    queryFn: () => apiGet<BulkTransactionLog | null>(`/bulk-transaction-log/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Bulk Transaction Log.
 * Automatically invalidates list queries on success.
 */
export function useCreateBulkTransactionLog(
  options?: UseMutationOptions<BulkTransactionLog, Error, Partial<BulkTransactionLog>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BulkTransactionLog>) => apiPost<BulkTransactionLog>('/bulk-transaction-log', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bulkTransactionLog.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Bulk Transaction Log.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBulkTransactionLog(
  options?: UseMutationOptions<BulkTransactionLog, Error, { id: string; data: Partial<BulkTransactionLog> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BulkTransactionLog> }) =>
      apiPut<BulkTransactionLog>(`/bulk-transaction-log/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bulkTransactionLog.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bulkTransactionLog.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Bulk Transaction Log by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBulkTransactionLog(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/bulk-transaction-log/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bulkTransactionLog.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
