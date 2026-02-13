// TanStack Query hooks for Asset Capitalization
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AssetCapitalization } from '../types/asset-capitalization.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AssetCapitalizationListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Asset Capitalization records.
 */
export function useAssetCapitalizationList(
  params: AssetCapitalizationListParams = {},
  options?: Omit<UseQueryOptions<AssetCapitalization[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.assetCapitalization.list(params),
    queryFn: () => apiGet<AssetCapitalization[]>(`/asset-capitalization${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Asset Capitalization by ID.
 */
export function useAssetCapitalization(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AssetCapitalization | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.assetCapitalization.detail(id ?? ''),
    queryFn: () => apiGet<AssetCapitalization | null>(`/asset-capitalization/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Asset Capitalization.
 * Automatically invalidates list queries on success.
 */
export function useCreateAssetCapitalization(
  options?: UseMutationOptions<AssetCapitalization, Error, Partial<AssetCapitalization>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AssetCapitalization>) => apiPost<AssetCapitalization>('/asset-capitalization', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetCapitalization.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Asset Capitalization.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAssetCapitalization(
  options?: UseMutationOptions<AssetCapitalization, Error, { id: string; data: Partial<AssetCapitalization> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AssetCapitalization> }) =>
      apiPut<AssetCapitalization>(`/asset-capitalization/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetCapitalization.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetCapitalization.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Asset Capitalization by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAssetCapitalization(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/asset-capitalization/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetCapitalization.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Asset Capitalization (set docstatus = 1).
 */
export function useSubmitAssetCapitalization(
  options?: UseMutationOptions<AssetCapitalization, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<AssetCapitalization>(`/asset-capitalization/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetCapitalization.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetCapitalization.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Asset Capitalization (set docstatus = 2).
 */
export function useCancelAssetCapitalization(
  options?: UseMutationOptions<AssetCapitalization, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<AssetCapitalization>(`/asset-capitalization/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetCapitalization.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetCapitalization.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
