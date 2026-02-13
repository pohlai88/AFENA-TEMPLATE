// TanStack Query hooks for Allowed Dimension
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AllowedDimension } from '../types/allowed-dimension.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AllowedDimensionListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Allowed Dimension records.
 */
export function useAllowedDimensionList(
  params: AllowedDimensionListParams = {},
  options?: Omit<UseQueryOptions<AllowedDimension[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.allowedDimension.list(params),
    queryFn: () => apiGet<AllowedDimension[]>(`/allowed-dimension${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Allowed Dimension by ID.
 */
export function useAllowedDimension(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AllowedDimension | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.allowedDimension.detail(id ?? ''),
    queryFn: () => apiGet<AllowedDimension | null>(`/allowed-dimension/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Allowed Dimension.
 * Automatically invalidates list queries on success.
 */
export function useCreateAllowedDimension(
  options?: UseMutationOptions<AllowedDimension, Error, Partial<AllowedDimension>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AllowedDimension>) => apiPost<AllowedDimension>('/allowed-dimension', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.allowedDimension.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Allowed Dimension.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAllowedDimension(
  options?: UseMutationOptions<AllowedDimension, Error, { id: string; data: Partial<AllowedDimension> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AllowedDimension> }) =>
      apiPut<AllowedDimension>(`/allowed-dimension/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.allowedDimension.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.allowedDimension.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Allowed Dimension by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAllowedDimension(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/allowed-dimension/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.allowedDimension.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
