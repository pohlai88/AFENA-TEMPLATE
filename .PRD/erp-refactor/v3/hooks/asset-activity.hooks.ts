// TanStack Query hooks for Asset Activity
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AssetActivity } from '../types/asset-activity.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AssetActivityListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Asset Activity records.
 */
export function useAssetActivityList(
  params: AssetActivityListParams = {},
  options?: Omit<UseQueryOptions<AssetActivity[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.assetActivity.list(params),
    queryFn: () => apiGet<AssetActivity[]>(`/asset-activity${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Asset Activity by ID.
 */
export function useAssetActivity(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AssetActivity | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.assetActivity.detail(id ?? ''),
    queryFn: () => apiGet<AssetActivity | null>(`/asset-activity/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Asset Activity.
 * Automatically invalidates list queries on success.
 */
export function useCreateAssetActivity(
  options?: UseMutationOptions<AssetActivity, Error, Partial<AssetActivity>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AssetActivity>) => apiPost<AssetActivity>('/asset-activity', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetActivity.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Asset Activity.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAssetActivity(
  options?: UseMutationOptions<AssetActivity, Error, { id: string; data: Partial<AssetActivity> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AssetActivity> }) =>
      apiPut<AssetActivity>(`/asset-activity/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetActivity.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetActivity.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Asset Activity by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAssetActivity(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/asset-activity/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetActivity.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
