// TanStack Query hooks for Competitor
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Competitor } from '../types/competitor.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface CompetitorListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Competitor records.
 */
export function useCompetitorList(
  params: CompetitorListParams = {},
  options?: Omit<UseQueryOptions<Competitor[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.competitor.list(params),
    queryFn: () => apiGet<Competitor[]>(`/competitor${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Competitor by ID.
 */
export function useCompetitor(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Competitor | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.competitor.detail(id ?? ''),
    queryFn: () => apiGet<Competitor | null>(`/competitor/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Competitor.
 * Automatically invalidates list queries on success.
 */
export function useCreateCompetitor(
  options?: UseMutationOptions<Competitor, Error, Partial<Competitor>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Competitor>) => apiPost<Competitor>('/competitor', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.competitor.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Competitor.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateCompetitor(
  options?: UseMutationOptions<Competitor, Error, { id: string; data: Partial<Competitor> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Competitor> }) =>
      apiPut<Competitor>(`/competitor/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.competitor.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.competitor.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Competitor by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteCompetitor(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/competitor/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.competitor.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
