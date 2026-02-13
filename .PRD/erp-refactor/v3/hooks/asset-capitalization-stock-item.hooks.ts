// TanStack Query hooks for Asset Capitalization Stock Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AssetCapitalizationStockItem } from '../types/asset-capitalization-stock-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AssetCapitalizationStockItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Asset Capitalization Stock Item records.
 */
export function useAssetCapitalizationStockItemList(
  params: AssetCapitalizationStockItemListParams = {},
  options?: Omit<UseQueryOptions<AssetCapitalizationStockItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.assetCapitalizationStockItem.list(params),
    queryFn: () => apiGet<AssetCapitalizationStockItem[]>(`/asset-capitalization-stock-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Asset Capitalization Stock Item by ID.
 */
export function useAssetCapitalizationStockItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AssetCapitalizationStockItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.assetCapitalizationStockItem.detail(id ?? ''),
    queryFn: () => apiGet<AssetCapitalizationStockItem | null>(`/asset-capitalization-stock-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Asset Capitalization Stock Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateAssetCapitalizationStockItem(
  options?: UseMutationOptions<AssetCapitalizationStockItem, Error, Partial<AssetCapitalizationStockItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AssetCapitalizationStockItem>) => apiPost<AssetCapitalizationStockItem>('/asset-capitalization-stock-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetCapitalizationStockItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Asset Capitalization Stock Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAssetCapitalizationStockItem(
  options?: UseMutationOptions<AssetCapitalizationStockItem, Error, { id: string; data: Partial<AssetCapitalizationStockItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AssetCapitalizationStockItem> }) =>
      apiPut<AssetCapitalizationStockItem>(`/asset-capitalization-stock-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetCapitalizationStockItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetCapitalizationStockItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Asset Capitalization Stock Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAssetCapitalizationStockItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/asset-capitalization-stock-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetCapitalizationStockItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
