// TanStack Query hooks for Asset
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Asset } from '../types/asset.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AssetListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Asset records.
 */
export function useAssetList(
  params: AssetListParams = {},
  options?: Omit<UseQueryOptions<Asset[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.asset.list(params),
    queryFn: () => apiGet<Asset[]>(`/asset${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Asset by ID.
 */
export function useAsset(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Asset | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.asset.detail(id ?? ''),
    queryFn: () => apiGet<Asset | null>(`/asset/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Asset.
 * Automatically invalidates list queries on success.
 */
export function useCreateAsset(
  options?: UseMutationOptions<Asset, Error, Partial<Asset>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Asset>) => apiPost<Asset>('/asset', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.asset.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Asset.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAsset(
  options?: UseMutationOptions<Asset, Error, { id: string; data: Partial<Asset> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Asset> }) =>
      apiPut<Asset>(`/asset/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.asset.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.asset.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Asset by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAsset(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/asset/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.asset.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Asset (set docstatus = 1).
 */
export function useSubmitAsset(
  options?: UseMutationOptions<Asset, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<Asset>(`/asset/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.asset.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.asset.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Asset (set docstatus = 2).
 */
export function useCancelAsset(
  options?: UseMutationOptions<Asset, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<Asset>(`/asset/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.asset.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.asset.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
