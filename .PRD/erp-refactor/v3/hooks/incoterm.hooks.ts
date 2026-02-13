// TanStack Query hooks for Incoterm
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Incoterm } from '../types/incoterm.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface IncotermListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Incoterm records.
 */
export function useIncotermList(
  params: IncotermListParams = {},
  options?: Omit<UseQueryOptions<Incoterm[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.incoterm.list(params),
    queryFn: () => apiGet<Incoterm[]>(`/incoterm${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Incoterm by ID.
 */
export function useIncoterm(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Incoterm | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.incoterm.detail(id ?? ''),
    queryFn: () => apiGet<Incoterm | null>(`/incoterm/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Incoterm.
 * Automatically invalidates list queries on success.
 */
export function useCreateIncoterm(
  options?: UseMutationOptions<Incoterm, Error, Partial<Incoterm>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Incoterm>) => apiPost<Incoterm>('/incoterm', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incoterm.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Incoterm.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateIncoterm(
  options?: UseMutationOptions<Incoterm, Error, { id: string; data: Partial<Incoterm> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Incoterm> }) =>
      apiPut<Incoterm>(`/incoterm/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incoterm.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.incoterm.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Incoterm by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteIncoterm(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/incoterm/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incoterm.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
