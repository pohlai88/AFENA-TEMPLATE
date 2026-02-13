// TanStack Query hooks for Asset Capitalization Service Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AssetCapitalizationServiceItem } from '../types/asset-capitalization-service-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AssetCapitalizationServiceItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Asset Capitalization Service Item records.
 */
export function useAssetCapitalizationServiceItemList(
  params: AssetCapitalizationServiceItemListParams = {},
  options?: Omit<UseQueryOptions<AssetCapitalizationServiceItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.assetCapitalizationServiceItem.list(params),
    queryFn: () => apiGet<AssetCapitalizationServiceItem[]>(`/asset-capitalization-service-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Asset Capitalization Service Item by ID.
 */
export function useAssetCapitalizationServiceItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AssetCapitalizationServiceItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.assetCapitalizationServiceItem.detail(id ?? ''),
    queryFn: () => apiGet<AssetCapitalizationServiceItem | null>(`/asset-capitalization-service-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Asset Capitalization Service Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateAssetCapitalizationServiceItem(
  options?: UseMutationOptions<AssetCapitalizationServiceItem, Error, Partial<AssetCapitalizationServiceItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AssetCapitalizationServiceItem>) => apiPost<AssetCapitalizationServiceItem>('/asset-capitalization-service-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetCapitalizationServiceItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Asset Capitalization Service Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAssetCapitalizationServiceItem(
  options?: UseMutationOptions<AssetCapitalizationServiceItem, Error, { id: string; data: Partial<AssetCapitalizationServiceItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AssetCapitalizationServiceItem> }) =>
      apiPut<AssetCapitalizationServiceItem>(`/asset-capitalization-service-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetCapitalizationServiceItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetCapitalizationServiceItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Asset Capitalization Service Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAssetCapitalizationServiceItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/asset-capitalization-service-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetCapitalizationServiceItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
