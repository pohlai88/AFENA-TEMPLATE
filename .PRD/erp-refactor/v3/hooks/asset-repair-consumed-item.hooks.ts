// TanStack Query hooks for Asset Repair Consumed Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AssetRepairConsumedItem } from '../types/asset-repair-consumed-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AssetRepairConsumedItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Asset Repair Consumed Item records.
 */
export function useAssetRepairConsumedItemList(
  params: AssetRepairConsumedItemListParams = {},
  options?: Omit<UseQueryOptions<AssetRepairConsumedItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.assetRepairConsumedItem.list(params),
    queryFn: () => apiGet<AssetRepairConsumedItem[]>(`/asset-repair-consumed-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Asset Repair Consumed Item by ID.
 */
export function useAssetRepairConsumedItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AssetRepairConsumedItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.assetRepairConsumedItem.detail(id ?? ''),
    queryFn: () => apiGet<AssetRepairConsumedItem | null>(`/asset-repair-consumed-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Asset Repair Consumed Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateAssetRepairConsumedItem(
  options?: UseMutationOptions<AssetRepairConsumedItem, Error, Partial<AssetRepairConsumedItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AssetRepairConsumedItem>) => apiPost<AssetRepairConsumedItem>('/asset-repair-consumed-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetRepairConsumedItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Asset Repair Consumed Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAssetRepairConsumedItem(
  options?: UseMutationOptions<AssetRepairConsumedItem, Error, { id: string; data: Partial<AssetRepairConsumedItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AssetRepairConsumedItem> }) =>
      apiPut<AssetRepairConsumedItem>(`/asset-repair-consumed-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetRepairConsumedItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetRepairConsumedItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Asset Repair Consumed Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAssetRepairConsumedItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/asset-repair-consumed-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetRepairConsumedItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
