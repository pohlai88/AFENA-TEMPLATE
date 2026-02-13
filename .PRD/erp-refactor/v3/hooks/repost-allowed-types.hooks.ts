// TanStack Query hooks for Repost Allowed Types
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { RepostAllowedTypes } from '../types/repost-allowed-types.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface RepostAllowedTypesListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Repost Allowed Types records.
 */
export function useRepostAllowedTypesList(
  params: RepostAllowedTypesListParams = {},
  options?: Omit<UseQueryOptions<RepostAllowedTypes[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.repostAllowedTypes.list(params),
    queryFn: () => apiGet<RepostAllowedTypes[]>(`/repost-allowed-types${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Repost Allowed Types by ID.
 */
export function useRepostAllowedTypes(
  id: string | undefined,
  options?: Omit<UseQueryOptions<RepostAllowedTypes | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.repostAllowedTypes.detail(id ?? ''),
    queryFn: () => apiGet<RepostAllowedTypes | null>(`/repost-allowed-types/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Repost Allowed Types.
 * Automatically invalidates list queries on success.
 */
export function useCreateRepostAllowedTypes(
  options?: UseMutationOptions<RepostAllowedTypes, Error, Partial<RepostAllowedTypes>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<RepostAllowedTypes>) => apiPost<RepostAllowedTypes>('/repost-allowed-types', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repostAllowedTypes.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Repost Allowed Types.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateRepostAllowedTypes(
  options?: UseMutationOptions<RepostAllowedTypes, Error, { id: string; data: Partial<RepostAllowedTypes> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RepostAllowedTypes> }) =>
      apiPut<RepostAllowedTypes>(`/repost-allowed-types/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repostAllowedTypes.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.repostAllowedTypes.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Repost Allowed Types by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteRepostAllowedTypes(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/repost-allowed-types/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repostAllowedTypes.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
