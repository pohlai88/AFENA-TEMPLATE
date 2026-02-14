// TanStack Query hooks for Asset Maintenance
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AssetMaintenance } from '../types/asset-maintenance.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AssetMaintenanceListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Asset Maintenance records.
 */
export function useAssetMaintenanceList(
  params: AssetMaintenanceListParams = {},
  options?: Omit<UseQueryOptions<AssetMaintenance[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.assetMaintenance.list(params),
    queryFn: () => apiGet<AssetMaintenance[]>(`/asset-maintenance${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Asset Maintenance by ID.
 */
export function useAssetMaintenance(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AssetMaintenance | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.assetMaintenance.detail(id ?? ''),
    queryFn: () => apiGet<AssetMaintenance | null>(`/asset-maintenance/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Asset Maintenance.
 * Automatically invalidates list queries on success.
 */
export function useCreateAssetMaintenance(
  options?: UseMutationOptions<AssetMaintenance, Error, Partial<AssetMaintenance>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AssetMaintenance>) => apiPost<AssetMaintenance>('/asset-maintenance', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMaintenance.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Asset Maintenance.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAssetMaintenance(
  options?: UseMutationOptions<AssetMaintenance, Error, { id: string; data: Partial<AssetMaintenance> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AssetMaintenance> }) =>
      apiPut<AssetMaintenance>(`/asset-maintenance/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMaintenance.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMaintenance.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Asset Maintenance by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAssetMaintenance(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/asset-maintenance/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMaintenance.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
