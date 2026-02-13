// TanStack Query hooks for Routing
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Routing } from '../types/routing.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface RoutingListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Routing records.
 */
export function useRoutingList(
  params: RoutingListParams = {},
  options?: Omit<UseQueryOptions<Routing[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.routing.list(params),
    queryFn: () => apiGet<Routing[]>(`/routing${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Routing by ID.
 */
export function useRouting(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Routing | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.routing.detail(id ?? ''),
    queryFn: () => apiGet<Routing | null>(`/routing/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Routing.
 * Automatically invalidates list queries on success.
 */
export function useCreateRouting(
  options?: UseMutationOptions<Routing, Error, Partial<Routing>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Routing>) => apiPost<Routing>('/routing', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.routing.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Routing.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateRouting(
  options?: UseMutationOptions<Routing, Error, { id: string; data: Partial<Routing> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Routing> }) =>
      apiPut<Routing>(`/routing/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.routing.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.routing.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Routing by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteRouting(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/routing/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.routing.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
