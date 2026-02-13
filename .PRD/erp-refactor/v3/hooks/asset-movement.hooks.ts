// TanStack Query hooks for Asset Movement
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AssetMovement } from '../types/asset-movement.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AssetMovementListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Asset Movement records.
 */
export function useAssetMovementList(
  params: AssetMovementListParams = {},
  options?: Omit<UseQueryOptions<AssetMovement[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.assetMovement.list(params),
    queryFn: () => apiGet<AssetMovement[]>(`/asset-movement${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Asset Movement by ID.
 */
export function useAssetMovement(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AssetMovement | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.assetMovement.detail(id ?? ''),
    queryFn: () => apiGet<AssetMovement | null>(`/asset-movement/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Asset Movement.
 * Automatically invalidates list queries on success.
 */
export function useCreateAssetMovement(
  options?: UseMutationOptions<AssetMovement, Error, Partial<AssetMovement>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AssetMovement>) => apiPost<AssetMovement>('/asset-movement', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMovement.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Asset Movement.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAssetMovement(
  options?: UseMutationOptions<AssetMovement, Error, { id: string; data: Partial<AssetMovement> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AssetMovement> }) =>
      apiPut<AssetMovement>(`/asset-movement/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMovement.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMovement.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Asset Movement by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAssetMovement(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/asset-movement/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMovement.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Asset Movement (set docstatus = 1).
 */
export function useSubmitAssetMovement(
  options?: UseMutationOptions<AssetMovement, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<AssetMovement>(`/asset-movement/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMovement.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMovement.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Asset Movement (set docstatus = 2).
 */
export function useCancelAssetMovement(
  options?: UseMutationOptions<AssetMovement, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<AssetMovement>(`/asset-movement/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMovement.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMovement.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
