// TanStack Query hooks for BOM Update Log
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BomUpdateLog } from '../types/bom-update-log.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BomUpdateLogListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of BOM Update Log records.
 */
export function useBomUpdateLogList(
  params: BomUpdateLogListParams = {},
  options?: Omit<UseQueryOptions<BomUpdateLog[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.bomUpdateLog.list(params),
    queryFn: () => apiGet<BomUpdateLog[]>(`/bom-update-log${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single BOM Update Log by ID.
 */
export function useBomUpdateLog(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BomUpdateLog | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.bomUpdateLog.detail(id ?? ''),
    queryFn: () => apiGet<BomUpdateLog | null>(`/bom-update-log/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new BOM Update Log.
 * Automatically invalidates list queries on success.
 */
export function useCreateBomUpdateLog(
  options?: UseMutationOptions<BomUpdateLog, Error, Partial<BomUpdateLog>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BomUpdateLog>) => apiPost<BomUpdateLog>('/bom-update-log', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomUpdateLog.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing BOM Update Log.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBomUpdateLog(
  options?: UseMutationOptions<BomUpdateLog, Error, { id: string; data: Partial<BomUpdateLog> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BomUpdateLog> }) =>
      apiPut<BomUpdateLog>(`/bom-update-log/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomUpdateLog.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bomUpdateLog.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a BOM Update Log by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBomUpdateLog(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/bom-update-log/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomUpdateLog.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a BOM Update Log (set docstatus = 1).
 */
export function useSubmitBomUpdateLog(
  options?: UseMutationOptions<BomUpdateLog, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<BomUpdateLog>(`/bom-update-log/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomUpdateLog.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bomUpdateLog.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a BOM Update Log (set docstatus = 2).
 */
export function useCancelBomUpdateLog(
  options?: UseMutationOptions<BomUpdateLog, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<BomUpdateLog>(`/bom-update-log/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomUpdateLog.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bomUpdateLog.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
