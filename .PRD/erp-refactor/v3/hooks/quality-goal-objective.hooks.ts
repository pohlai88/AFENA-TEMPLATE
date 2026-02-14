// TanStack Query hooks for Quality Goal Objective
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { QualityGoalObjective } from '../types/quality-goal-objective.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface QualityGoalObjectiveListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Quality Goal Objective records.
 */
export function useQualityGoalObjectiveList(
  params: QualityGoalObjectiveListParams = {},
  options?: Omit<UseQueryOptions<QualityGoalObjective[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.qualityGoalObjective.list(params),
    queryFn: () => apiGet<QualityGoalObjective[]>(`/quality-goal-objective${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Quality Goal Objective by ID.
 */
export function useQualityGoalObjective(
  id: string | undefined,
  options?: Omit<UseQueryOptions<QualityGoalObjective | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.qualityGoalObjective.detail(id ?? ''),
    queryFn: () => apiGet<QualityGoalObjective | null>(`/quality-goal-objective/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Quality Goal Objective.
 * Automatically invalidates list queries on success.
 */
export function useCreateQualityGoalObjective(
  options?: UseMutationOptions<QualityGoalObjective, Error, Partial<QualityGoalObjective>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<QualityGoalObjective>) => apiPost<QualityGoalObjective>('/quality-goal-objective', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityGoalObjective.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Quality Goal Objective.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateQualityGoalObjective(
  options?: UseMutationOptions<QualityGoalObjective, Error, { id: string; data: Partial<QualityGoalObjective> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<QualityGoalObjective> }) =>
      apiPut<QualityGoalObjective>(`/quality-goal-objective/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityGoalObjective.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityGoalObjective.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Quality Goal Objective by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteQualityGoalObjective(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/quality-goal-objective/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityGoalObjective.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
