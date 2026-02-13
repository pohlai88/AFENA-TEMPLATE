// TanStack Query hooks for Quality Goal
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { QualityGoal } from '../types/quality-goal.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface QualityGoalListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Quality Goal records.
 */
export function useQualityGoalList(
  params: QualityGoalListParams = {},
  options?: Omit<UseQueryOptions<QualityGoal[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.qualityGoal.list(params),
    queryFn: () => apiGet<QualityGoal[]>(`/quality-goal${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Quality Goal by ID.
 */
export function useQualityGoal(
  id: string | undefined,
  options?: Omit<UseQueryOptions<QualityGoal | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.qualityGoal.detail(id ?? ''),
    queryFn: () => apiGet<QualityGoal | null>(`/quality-goal/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Quality Goal.
 * Automatically invalidates list queries on success.
 */
export function useCreateQualityGoal(
  options?: UseMutationOptions<QualityGoal, Error, Partial<QualityGoal>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<QualityGoal>) => apiPost<QualityGoal>('/quality-goal', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityGoal.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Quality Goal.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateQualityGoal(
  options?: UseMutationOptions<QualityGoal, Error, { id: string; data: Partial<QualityGoal> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<QualityGoal> }) =>
      apiPut<QualityGoal>(`/quality-goal/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityGoal.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityGoal.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Quality Goal by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteQualityGoal(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/quality-goal/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityGoal.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
