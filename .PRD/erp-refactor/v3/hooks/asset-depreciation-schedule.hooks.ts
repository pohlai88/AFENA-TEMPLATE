// TanStack Query hooks for Asset Depreciation Schedule
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AssetDepreciationSchedule } from '../types/asset-depreciation-schedule.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AssetDepreciationScheduleListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Asset Depreciation Schedule records.
 */
export function useAssetDepreciationScheduleList(
  params: AssetDepreciationScheduleListParams = {},
  options?: Omit<UseQueryOptions<AssetDepreciationSchedule[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.assetDepreciationSchedule.list(params),
    queryFn: () => apiGet<AssetDepreciationSchedule[]>(`/asset-depreciation-schedule${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Asset Depreciation Schedule by ID.
 */
export function useAssetDepreciationSchedule(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AssetDepreciationSchedule | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.assetDepreciationSchedule.detail(id ?? ''),
    queryFn: () => apiGet<AssetDepreciationSchedule | null>(`/asset-depreciation-schedule/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Asset Depreciation Schedule.
 * Automatically invalidates list queries on success.
 */
export function useCreateAssetDepreciationSchedule(
  options?: UseMutationOptions<AssetDepreciationSchedule, Error, Partial<AssetDepreciationSchedule>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AssetDepreciationSchedule>) => apiPost<AssetDepreciationSchedule>('/asset-depreciation-schedule', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetDepreciationSchedule.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Asset Depreciation Schedule.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAssetDepreciationSchedule(
  options?: UseMutationOptions<AssetDepreciationSchedule, Error, { id: string; data: Partial<AssetDepreciationSchedule> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AssetDepreciationSchedule> }) =>
      apiPut<AssetDepreciationSchedule>(`/asset-depreciation-schedule/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetDepreciationSchedule.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetDepreciationSchedule.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Asset Depreciation Schedule by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAssetDepreciationSchedule(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/asset-depreciation-schedule/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetDepreciationSchedule.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Asset Depreciation Schedule (set docstatus = 1).
 */
export function useSubmitAssetDepreciationSchedule(
  options?: UseMutationOptions<AssetDepreciationSchedule, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<AssetDepreciationSchedule>(`/asset-depreciation-schedule/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetDepreciationSchedule.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetDepreciationSchedule.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Asset Depreciation Schedule (set docstatus = 2).
 */
export function useCancelAssetDepreciationSchedule(
  options?: UseMutationOptions<AssetDepreciationSchedule, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<AssetDepreciationSchedule>(`/asset-depreciation-schedule/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetDepreciationSchedule.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetDepreciationSchedule.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
