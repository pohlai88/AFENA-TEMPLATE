// TanStack Query hooks for Asset Shift Factor
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AssetShiftFactor } from '../types/asset-shift-factor.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AssetShiftFactorListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Asset Shift Factor records.
 */
export function useAssetShiftFactorList(
  params: AssetShiftFactorListParams = {},
  options?: Omit<UseQueryOptions<AssetShiftFactor[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.assetShiftFactor.list(params),
    queryFn: () => apiGet<AssetShiftFactor[]>(`/asset-shift-factor${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Asset Shift Factor by ID.
 */
export function useAssetShiftFactor(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AssetShiftFactor | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.assetShiftFactor.detail(id ?? ''),
    queryFn: () => apiGet<AssetShiftFactor | null>(`/asset-shift-factor/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Asset Shift Factor.
 * Automatically invalidates list queries on success.
 */
export function useCreateAssetShiftFactor(
  options?: UseMutationOptions<AssetShiftFactor, Error, Partial<AssetShiftFactor>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AssetShiftFactor>) => apiPost<AssetShiftFactor>('/asset-shift-factor', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetShiftFactor.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Asset Shift Factor.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAssetShiftFactor(
  options?: UseMutationOptions<AssetShiftFactor, Error, { id: string; data: Partial<AssetShiftFactor> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AssetShiftFactor> }) =>
      apiPut<AssetShiftFactor>(`/asset-shift-factor/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetShiftFactor.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetShiftFactor.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Asset Shift Factor by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAssetShiftFactor(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/asset-shift-factor/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetShiftFactor.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
