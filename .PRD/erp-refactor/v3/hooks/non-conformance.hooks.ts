// TanStack Query hooks for Non Conformance
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { NonConformance } from '../types/non-conformance.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface NonConformanceListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Non Conformance records.
 */
export function useNonConformanceList(
  params: NonConformanceListParams = {},
  options?: Omit<UseQueryOptions<NonConformance[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.nonConformance.list(params),
    queryFn: () => apiGet<NonConformance[]>(`/non-conformance${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Non Conformance by ID.
 */
export function useNonConformance(
  id: string | undefined,
  options?: Omit<UseQueryOptions<NonConformance | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.nonConformance.detail(id ?? ''),
    queryFn: () => apiGet<NonConformance | null>(`/non-conformance/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Non Conformance.
 * Automatically invalidates list queries on success.
 */
export function useCreateNonConformance(
  options?: UseMutationOptions<NonConformance, Error, Partial<NonConformance>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<NonConformance>) => apiPost<NonConformance>('/non-conformance', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nonConformance.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Non Conformance.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateNonConformance(
  options?: UseMutationOptions<NonConformance, Error, { id: string; data: Partial<NonConformance> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NonConformance> }) =>
      apiPut<NonConformance>(`/non-conformance/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nonConformance.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.nonConformance.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Non Conformance by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteNonConformance(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/non-conformance/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nonConformance.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
