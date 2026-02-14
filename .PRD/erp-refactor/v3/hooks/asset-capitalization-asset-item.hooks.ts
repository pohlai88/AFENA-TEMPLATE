// TanStack Query hooks for Asset Capitalization Asset Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AssetCapitalizationAssetItem } from '../types/asset-capitalization-asset-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AssetCapitalizationAssetItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Asset Capitalization Asset Item records.
 */
export function useAssetCapitalizationAssetItemList(
  params: AssetCapitalizationAssetItemListParams = {},
  options?: Omit<UseQueryOptions<AssetCapitalizationAssetItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.assetCapitalizationAssetItem.list(params),
    queryFn: () => apiGet<AssetCapitalizationAssetItem[]>(`/asset-capitalization-asset-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Asset Capitalization Asset Item by ID.
 */
export function useAssetCapitalizationAssetItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AssetCapitalizationAssetItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.assetCapitalizationAssetItem.detail(id ?? ''),
    queryFn: () => apiGet<AssetCapitalizationAssetItem | null>(`/asset-capitalization-asset-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Asset Capitalization Asset Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateAssetCapitalizationAssetItem(
  options?: UseMutationOptions<AssetCapitalizationAssetItem, Error, Partial<AssetCapitalizationAssetItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AssetCapitalizationAssetItem>) => apiPost<AssetCapitalizationAssetItem>('/asset-capitalization-asset-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetCapitalizationAssetItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Asset Capitalization Asset Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAssetCapitalizationAssetItem(
  options?: UseMutationOptions<AssetCapitalizationAssetItem, Error, { id: string; data: Partial<AssetCapitalizationAssetItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AssetCapitalizationAssetItem> }) =>
      apiPut<AssetCapitalizationAssetItem>(`/asset-capitalization-asset-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetCapitalizationAssetItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetCapitalizationAssetItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Asset Capitalization Asset Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAssetCapitalizationAssetItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/asset-capitalization-asset-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetCapitalizationAssetItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
