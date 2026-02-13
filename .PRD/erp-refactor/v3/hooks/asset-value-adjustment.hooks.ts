// TanStack Query hooks for Asset Value Adjustment
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AssetValueAdjustment } from '../types/asset-value-adjustment.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AssetValueAdjustmentListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Asset Value Adjustment records.
 */
export function useAssetValueAdjustmentList(
  params: AssetValueAdjustmentListParams = {},
  options?: Omit<UseQueryOptions<AssetValueAdjustment[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.assetValueAdjustment.list(params),
    queryFn: () => apiGet<AssetValueAdjustment[]>(`/asset-value-adjustment${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Asset Value Adjustment by ID.
 */
export function useAssetValueAdjustment(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AssetValueAdjustment | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.assetValueAdjustment.detail(id ?? ''),
    queryFn: () => apiGet<AssetValueAdjustment | null>(`/asset-value-adjustment/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Asset Value Adjustment.
 * Automatically invalidates list queries on success.
 */
export function useCreateAssetValueAdjustment(
  options?: UseMutationOptions<AssetValueAdjustment, Error, Partial<AssetValueAdjustment>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AssetValueAdjustment>) => apiPost<AssetValueAdjustment>('/asset-value-adjustment', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetValueAdjustment.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Asset Value Adjustment.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAssetValueAdjustment(
  options?: UseMutationOptions<AssetValueAdjustment, Error, { id: string; data: Partial<AssetValueAdjustment> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AssetValueAdjustment> }) =>
      apiPut<AssetValueAdjustment>(`/asset-value-adjustment/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetValueAdjustment.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetValueAdjustment.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Asset Value Adjustment by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAssetValueAdjustment(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/asset-value-adjustment/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetValueAdjustment.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Asset Value Adjustment (set docstatus = 1).
 */
export function useSubmitAssetValueAdjustment(
  options?: UseMutationOptions<AssetValueAdjustment, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<AssetValueAdjustment>(`/asset-value-adjustment/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetValueAdjustment.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetValueAdjustment.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Asset Value Adjustment (set docstatus = 2).
 */
export function useCancelAssetValueAdjustment(
  options?: UseMutationOptions<AssetValueAdjustment, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<AssetValueAdjustment>(`/asset-value-adjustment/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetValueAdjustment.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetValueAdjustment.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
