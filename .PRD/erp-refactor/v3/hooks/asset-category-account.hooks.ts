// TanStack Query hooks for Asset Category Account
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AssetCategoryAccount } from '../types/asset-category-account.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AssetCategoryAccountListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Asset Category Account records.
 */
export function useAssetCategoryAccountList(
  params: AssetCategoryAccountListParams = {},
  options?: Omit<UseQueryOptions<AssetCategoryAccount[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.assetCategoryAccount.list(params),
    queryFn: () => apiGet<AssetCategoryAccount[]>(`/asset-category-account${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Asset Category Account by ID.
 */
export function useAssetCategoryAccount(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AssetCategoryAccount | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.assetCategoryAccount.detail(id ?? ''),
    queryFn: () => apiGet<AssetCategoryAccount | null>(`/asset-category-account/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Asset Category Account.
 * Automatically invalidates list queries on success.
 */
export function useCreateAssetCategoryAccount(
  options?: UseMutationOptions<AssetCategoryAccount, Error, Partial<AssetCategoryAccount>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AssetCategoryAccount>) => apiPost<AssetCategoryAccount>('/asset-category-account', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetCategoryAccount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Asset Category Account.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAssetCategoryAccount(
  options?: UseMutationOptions<AssetCategoryAccount, Error, { id: string; data: Partial<AssetCategoryAccount> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AssetCategoryAccount> }) =>
      apiPut<AssetCategoryAccount>(`/asset-category-account/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetCategoryAccount.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetCategoryAccount.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Asset Category Account by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAssetCategoryAccount(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/asset-category-account/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetCategoryAccount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
