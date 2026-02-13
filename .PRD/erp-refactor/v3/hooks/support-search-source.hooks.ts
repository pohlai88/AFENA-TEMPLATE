// TanStack Query hooks for Support Search Source
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SupportSearchSource } from '../types/support-search-source.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SupportSearchSourceListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Support Search Source records.
 */
export function useSupportSearchSourceList(
  params: SupportSearchSourceListParams = {},
  options?: Omit<UseQueryOptions<SupportSearchSource[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.supportSearchSource.list(params),
    queryFn: () => apiGet<SupportSearchSource[]>(`/support-search-source${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Support Search Source by ID.
 */
export function useSupportSearchSource(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SupportSearchSource | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.supportSearchSource.detail(id ?? ''),
    queryFn: () => apiGet<SupportSearchSource | null>(`/support-search-source/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Support Search Source.
 * Automatically invalidates list queries on success.
 */
export function useCreateSupportSearchSource(
  options?: UseMutationOptions<SupportSearchSource, Error, Partial<SupportSearchSource>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SupportSearchSource>) => apiPost<SupportSearchSource>('/support-search-source', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supportSearchSource.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Support Search Source.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSupportSearchSource(
  options?: UseMutationOptions<SupportSearchSource, Error, { id: string; data: Partial<SupportSearchSource> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SupportSearchSource> }) =>
      apiPut<SupportSearchSource>(`/support-search-source/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supportSearchSource.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.supportSearchSource.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Support Search Source by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSupportSearchSource(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/support-search-source/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supportSearchSource.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
