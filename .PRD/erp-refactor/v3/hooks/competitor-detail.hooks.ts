// TanStack Query hooks for Competitor Detail
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { CompetitorDetail } from '../types/competitor-detail.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface CompetitorDetailListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Competitor Detail records.
 */
export function useCompetitorDetailList(
  params: CompetitorDetailListParams = {},
  options?: Omit<UseQueryOptions<CompetitorDetail[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.competitorDetail.list(params),
    queryFn: () => apiGet<CompetitorDetail[]>(`/competitor-detail${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Competitor Detail by ID.
 */
export function useCompetitorDetail(
  id: string | undefined,
  options?: Omit<UseQueryOptions<CompetitorDetail | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.competitorDetail.detail(id ?? ''),
    queryFn: () => apiGet<CompetitorDetail | null>(`/competitor-detail/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Competitor Detail.
 * Automatically invalidates list queries on success.
 */
export function useCreateCompetitorDetail(
  options?: UseMutationOptions<CompetitorDetail, Error, Partial<CompetitorDetail>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CompetitorDetail>) => apiPost<CompetitorDetail>('/competitor-detail', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.competitorDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Competitor Detail.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateCompetitorDetail(
  options?: UseMutationOptions<CompetitorDetail, Error, { id: string; data: Partial<CompetitorDetail> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CompetitorDetail> }) =>
      apiPut<CompetitorDetail>(`/competitor-detail/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.competitorDetail.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.competitorDetail.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Competitor Detail by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteCompetitorDetail(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/competitor-detail/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.competitorDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
