// TanStack Query hooks for Allowed To Transact With
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AllowedToTransactWith } from '../types/allowed-to-transact-with.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AllowedToTransactWithListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Allowed To Transact With records.
 */
export function useAllowedToTransactWithList(
  params: AllowedToTransactWithListParams = {},
  options?: Omit<UseQueryOptions<AllowedToTransactWith[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.allowedToTransactWith.list(params),
    queryFn: () => apiGet<AllowedToTransactWith[]>(`/allowed-to-transact-with${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Allowed To Transact With by ID.
 */
export function useAllowedToTransactWith(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AllowedToTransactWith | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.allowedToTransactWith.detail(id ?? ''),
    queryFn: () => apiGet<AllowedToTransactWith | null>(`/allowed-to-transact-with/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Allowed To Transact With.
 * Automatically invalidates list queries on success.
 */
export function useCreateAllowedToTransactWith(
  options?: UseMutationOptions<AllowedToTransactWith, Error, Partial<AllowedToTransactWith>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AllowedToTransactWith>) => apiPost<AllowedToTransactWith>('/allowed-to-transact-with', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.allowedToTransactWith.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Allowed To Transact With.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAllowedToTransactWith(
  options?: UseMutationOptions<AllowedToTransactWith, Error, { id: string; data: Partial<AllowedToTransactWith> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AllowedToTransactWith> }) =>
      apiPut<AllowedToTransactWith>(`/allowed-to-transact-with/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.allowedToTransactWith.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.allowedToTransactWith.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Allowed To Transact With by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAllowedToTransactWith(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/allowed-to-transact-with/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.allowedToTransactWith.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
