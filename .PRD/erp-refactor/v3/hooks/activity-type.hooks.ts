// TanStack Query hooks for Activity Type
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ActivityType } from '../types/activity-type.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ActivityTypeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Activity Type records.
 */
export function useActivityTypeList(
  params: ActivityTypeListParams = {},
  options?: Omit<UseQueryOptions<ActivityType[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.activityType.list(params),
    queryFn: () => apiGet<ActivityType[]>(`/activity-type${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Activity Type by ID.
 */
export function useActivityType(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ActivityType | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.activityType.detail(id ?? ''),
    queryFn: () => apiGet<ActivityType | null>(`/activity-type/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Activity Type.
 * Automatically invalidates list queries on success.
 */
export function useCreateActivityType(
  options?: UseMutationOptions<ActivityType, Error, Partial<ActivityType>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ActivityType>) => apiPost<ActivityType>('/activity-type', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activityType.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Activity Type.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateActivityType(
  options?: UseMutationOptions<ActivityType, Error, { id: string; data: Partial<ActivityType> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ActivityType> }) =>
      apiPut<ActivityType>(`/activity-type/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activityType.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.activityType.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Activity Type by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteActivityType(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/activity-type/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activityType.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
