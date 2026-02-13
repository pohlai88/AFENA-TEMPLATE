// TanStack Query hooks for Asset Maintenance Log
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AssetMaintenanceLog } from '../types/asset-maintenance-log.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AssetMaintenanceLogListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Asset Maintenance Log records.
 */
export function useAssetMaintenanceLogList(
  params: AssetMaintenanceLogListParams = {},
  options?: Omit<UseQueryOptions<AssetMaintenanceLog[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.assetMaintenanceLog.list(params),
    queryFn: () => apiGet<AssetMaintenanceLog[]>(`/asset-maintenance-log${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Asset Maintenance Log by ID.
 */
export function useAssetMaintenanceLog(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AssetMaintenanceLog | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.assetMaintenanceLog.detail(id ?? ''),
    queryFn: () => apiGet<AssetMaintenanceLog | null>(`/asset-maintenance-log/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Asset Maintenance Log.
 * Automatically invalidates list queries on success.
 */
export function useCreateAssetMaintenanceLog(
  options?: UseMutationOptions<AssetMaintenanceLog, Error, Partial<AssetMaintenanceLog>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AssetMaintenanceLog>) => apiPost<AssetMaintenanceLog>('/asset-maintenance-log', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMaintenanceLog.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Asset Maintenance Log.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAssetMaintenanceLog(
  options?: UseMutationOptions<AssetMaintenanceLog, Error, { id: string; data: Partial<AssetMaintenanceLog> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AssetMaintenanceLog> }) =>
      apiPut<AssetMaintenanceLog>(`/asset-maintenance-log/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMaintenanceLog.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMaintenanceLog.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Asset Maintenance Log by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAssetMaintenanceLog(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/asset-maintenance-log/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMaintenanceLog.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Asset Maintenance Log (set docstatus = 1).
 */
export function useSubmitAssetMaintenanceLog(
  options?: UseMutationOptions<AssetMaintenanceLog, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<AssetMaintenanceLog>(`/asset-maintenance-log/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMaintenanceLog.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMaintenanceLog.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Asset Maintenance Log (set docstatus = 2).
 */
export function useCancelAssetMaintenanceLog(
  options?: UseMutationOptions<AssetMaintenanceLog, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<AssetMaintenanceLog>(`/asset-maintenance-log/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMaintenanceLog.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMaintenanceLog.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
