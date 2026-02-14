// TanStack Query hooks for Asset Repair
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AssetRepair } from '../types/asset-repair.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AssetRepairListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Asset Repair records.
 */
export function useAssetRepairList(
  params: AssetRepairListParams = {},
  options?: Omit<UseQueryOptions<AssetRepair[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.assetRepair.list(params),
    queryFn: () => apiGet<AssetRepair[]>(`/asset-repair${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Asset Repair by ID.
 */
export function useAssetRepair(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AssetRepair | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.assetRepair.detail(id ?? ''),
    queryFn: () => apiGet<AssetRepair | null>(`/asset-repair/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Asset Repair.
 * Automatically invalidates list queries on success.
 */
export function useCreateAssetRepair(
  options?: UseMutationOptions<AssetRepair, Error, Partial<AssetRepair>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AssetRepair>) => apiPost<AssetRepair>('/asset-repair', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetRepair.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Asset Repair.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAssetRepair(
  options?: UseMutationOptions<AssetRepair, Error, { id: string; data: Partial<AssetRepair> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AssetRepair> }) =>
      apiPut<AssetRepair>(`/asset-repair/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetRepair.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetRepair.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Asset Repair by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAssetRepair(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/asset-repair/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetRepair.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Asset Repair (set docstatus = 1).
 */
export function useSubmitAssetRepair(
  options?: UseMutationOptions<AssetRepair, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<AssetRepair>(`/asset-repair/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetRepair.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetRepair.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Asset Repair (set docstatus = 2).
 */
export function useCancelAssetRepair(
  options?: UseMutationOptions<AssetRepair, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<AssetRepair>(`/asset-repair/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetRepair.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetRepair.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
