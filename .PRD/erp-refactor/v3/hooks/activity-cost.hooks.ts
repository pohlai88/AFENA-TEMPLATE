// TanStack Query hooks for Activity Cost
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ActivityCost } from '../types/activity-cost.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ActivityCostListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Activity Cost records.
 */
export function useActivityCostList(
  params: ActivityCostListParams = {},
  options?: Omit<UseQueryOptions<ActivityCost[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.activityCost.list(params),
    queryFn: () => apiGet<ActivityCost[]>(`/activity-cost${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Activity Cost by ID.
 */
export function useActivityCost(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ActivityCost | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.activityCost.detail(id ?? ''),
    queryFn: () => apiGet<ActivityCost | null>(`/activity-cost/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Activity Cost.
 * Automatically invalidates list queries on success.
 */
export function useCreateActivityCost(
  options?: UseMutationOptions<ActivityCost, Error, Partial<ActivityCost>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ActivityCost>) => apiPost<ActivityCost>('/activity-cost', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activityCost.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Activity Cost.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateActivityCost(
  options?: UseMutationOptions<ActivityCost, Error, { id: string; data: Partial<ActivityCost> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ActivityCost> }) =>
      apiPut<ActivityCost>(`/activity-cost/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activityCost.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.activityCost.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Activity Cost by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteActivityCost(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/activity-cost/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activityCost.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
