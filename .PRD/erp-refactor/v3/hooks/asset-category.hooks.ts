// TanStack Query hooks for Asset Category
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AssetCategory } from '../types/asset-category.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AssetCategoryListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Asset Category records.
 */
export function useAssetCategoryList(
  params: AssetCategoryListParams = {},
  options?: Omit<UseQueryOptions<AssetCategory[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.assetCategory.list(params),
    queryFn: () => apiGet<AssetCategory[]>(`/asset-category${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Asset Category by ID.
 */
export function useAssetCategory(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AssetCategory | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.assetCategory.detail(id ?? ''),
    queryFn: () => apiGet<AssetCategory | null>(`/asset-category/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Asset Category.
 * Automatically invalidates list queries on success.
 */
export function useCreateAssetCategory(
  options?: UseMutationOptions<AssetCategory, Error, Partial<AssetCategory>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AssetCategory>) => apiPost<AssetCategory>('/asset-category', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetCategory.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Asset Category.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAssetCategory(
  options?: UseMutationOptions<AssetCategory, Error, { id: string; data: Partial<AssetCategory> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AssetCategory> }) =>
      apiPut<AssetCategory>(`/asset-category/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetCategory.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetCategory.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Asset Category by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAssetCategory(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/asset-category/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetCategory.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
