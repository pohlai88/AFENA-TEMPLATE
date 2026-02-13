// TanStack Query hooks for Asset Shift Allocation
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AssetShiftAllocation } from '../types/asset-shift-allocation.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AssetShiftAllocationListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Asset Shift Allocation records.
 */
export function useAssetShiftAllocationList(
  params: AssetShiftAllocationListParams = {},
  options?: Omit<UseQueryOptions<AssetShiftAllocation[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.assetShiftAllocation.list(params),
    queryFn: () => apiGet<AssetShiftAllocation[]>(`/asset-shift-allocation${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Asset Shift Allocation by ID.
 */
export function useAssetShiftAllocation(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AssetShiftAllocation | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.assetShiftAllocation.detail(id ?? ''),
    queryFn: () => apiGet<AssetShiftAllocation | null>(`/asset-shift-allocation/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Asset Shift Allocation.
 * Automatically invalidates list queries on success.
 */
export function useCreateAssetShiftAllocation(
  options?: UseMutationOptions<AssetShiftAllocation, Error, Partial<AssetShiftAllocation>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AssetShiftAllocation>) => apiPost<AssetShiftAllocation>('/asset-shift-allocation', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetShiftAllocation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Asset Shift Allocation.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAssetShiftAllocation(
  options?: UseMutationOptions<AssetShiftAllocation, Error, { id: string; data: Partial<AssetShiftAllocation> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AssetShiftAllocation> }) =>
      apiPut<AssetShiftAllocation>(`/asset-shift-allocation/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetShiftAllocation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetShiftAllocation.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Asset Shift Allocation by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAssetShiftAllocation(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/asset-shift-allocation/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetShiftAllocation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Asset Shift Allocation (set docstatus = 1).
 */
export function useSubmitAssetShiftAllocation(
  options?: UseMutationOptions<AssetShiftAllocation, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<AssetShiftAllocation>(`/asset-shift-allocation/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetShiftAllocation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetShiftAllocation.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Asset Shift Allocation (set docstatus = 2).
 */
export function useCancelAssetShiftAllocation(
  options?: UseMutationOptions<AssetShiftAllocation, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<AssetShiftAllocation>(`/asset-shift-allocation/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetShiftAllocation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetShiftAllocation.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
