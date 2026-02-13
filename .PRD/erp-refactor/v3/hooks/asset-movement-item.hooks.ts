// TanStack Query hooks for Asset Movement Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AssetMovementItem } from '../types/asset-movement-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AssetMovementItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Asset Movement Item records.
 */
export function useAssetMovementItemList(
  params: AssetMovementItemListParams = {},
  options?: Omit<UseQueryOptions<AssetMovementItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.assetMovementItem.list(params),
    queryFn: () => apiGet<AssetMovementItem[]>(`/asset-movement-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Asset Movement Item by ID.
 */
export function useAssetMovementItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AssetMovementItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.assetMovementItem.detail(id ?? ''),
    queryFn: () => apiGet<AssetMovementItem | null>(`/asset-movement-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Asset Movement Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateAssetMovementItem(
  options?: UseMutationOptions<AssetMovementItem, Error, Partial<AssetMovementItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AssetMovementItem>) => apiPost<AssetMovementItem>('/asset-movement-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMovementItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Asset Movement Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAssetMovementItem(
  options?: UseMutationOptions<AssetMovementItem, Error, { id: string; data: Partial<AssetMovementItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AssetMovementItem> }) =>
      apiPut<AssetMovementItem>(`/asset-movement-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMovementItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMovementItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Asset Movement Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAssetMovementItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/asset-movement-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMovementItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
