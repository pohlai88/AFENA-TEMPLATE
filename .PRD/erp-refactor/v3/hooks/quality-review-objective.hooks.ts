// TanStack Query hooks for Quality Review Objective
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { QualityReviewObjective } from '../types/quality-review-objective.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface QualityReviewObjectiveListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Quality Review Objective records.
 */
export function useQualityReviewObjectiveList(
  params: QualityReviewObjectiveListParams = {},
  options?: Omit<UseQueryOptions<QualityReviewObjective[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.qualityReviewObjective.list(params),
    queryFn: () => apiGet<QualityReviewObjective[]>(`/quality-review-objective${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Quality Review Objective by ID.
 */
export function useQualityReviewObjective(
  id: string | undefined,
  options?: Omit<UseQueryOptions<QualityReviewObjective | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.qualityReviewObjective.detail(id ?? ''),
    queryFn: () => apiGet<QualityReviewObjective | null>(`/quality-review-objective/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Quality Review Objective.
 * Automatically invalidates list queries on success.
 */
export function useCreateQualityReviewObjective(
  options?: UseMutationOptions<QualityReviewObjective, Error, Partial<QualityReviewObjective>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<QualityReviewObjective>) => apiPost<QualityReviewObjective>('/quality-review-objective', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityReviewObjective.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Quality Review Objective.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateQualityReviewObjective(
  options?: UseMutationOptions<QualityReviewObjective, Error, { id: string; data: Partial<QualityReviewObjective> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<QualityReviewObjective> }) =>
      apiPut<QualityReviewObjective>(`/quality-review-objective/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityReviewObjective.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityReviewObjective.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Quality Review Objective by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteQualityReviewObjective(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/quality-review-objective/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityReviewObjective.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
