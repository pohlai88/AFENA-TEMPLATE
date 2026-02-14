// TanStack Query hooks for POS Invoice Merge Log
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PosInvoiceMergeLog } from '../types/pos-invoice-merge-log.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PosInvoiceMergeLogListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of POS Invoice Merge Log records.
 */
export function usePosInvoiceMergeLogList(
  params: PosInvoiceMergeLogListParams = {},
  options?: Omit<UseQueryOptions<PosInvoiceMergeLog[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.posInvoiceMergeLog.list(params),
    queryFn: () => apiGet<PosInvoiceMergeLog[]>(`/pos-invoice-merge-log${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single POS Invoice Merge Log by ID.
 */
export function usePosInvoiceMergeLog(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PosInvoiceMergeLog | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.posInvoiceMergeLog.detail(id ?? ''),
    queryFn: () => apiGet<PosInvoiceMergeLog | null>(`/pos-invoice-merge-log/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new POS Invoice Merge Log.
 * Automatically invalidates list queries on success.
 */
export function useCreatePosInvoiceMergeLog(
  options?: UseMutationOptions<PosInvoiceMergeLog, Error, Partial<PosInvoiceMergeLog>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PosInvoiceMergeLog>) => apiPost<PosInvoiceMergeLog>('/pos-invoice-merge-log', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posInvoiceMergeLog.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing POS Invoice Merge Log.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePosInvoiceMergeLog(
  options?: UseMutationOptions<PosInvoiceMergeLog, Error, { id: string; data: Partial<PosInvoiceMergeLog> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PosInvoiceMergeLog> }) =>
      apiPut<PosInvoiceMergeLog>(`/pos-invoice-merge-log/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posInvoiceMergeLog.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posInvoiceMergeLog.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a POS Invoice Merge Log by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePosInvoiceMergeLog(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/pos-invoice-merge-log/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posInvoiceMergeLog.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a POS Invoice Merge Log (set docstatus = 1).
 */
export function useSubmitPosInvoiceMergeLog(
  options?: UseMutationOptions<PosInvoiceMergeLog, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<PosInvoiceMergeLog>(`/pos-invoice-merge-log/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posInvoiceMergeLog.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posInvoiceMergeLog.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a POS Invoice Merge Log (set docstatus = 2).
 */
export function useCancelPosInvoiceMergeLog(
  options?: UseMutationOptions<PosInvoiceMergeLog, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<PosInvoiceMergeLog>(`/pos-invoice-merge-log/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posInvoiceMergeLog.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posInvoiceMergeLog.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
