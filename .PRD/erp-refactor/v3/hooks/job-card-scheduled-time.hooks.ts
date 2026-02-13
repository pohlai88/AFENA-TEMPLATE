// TanStack Query hooks for Job Card Scheduled Time
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { JobCardScheduledTime } from '../types/job-card-scheduled-time.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface JobCardScheduledTimeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Job Card Scheduled Time records.
 */
export function useJobCardScheduledTimeList(
  params: JobCardScheduledTimeListParams = {},
  options?: Omit<UseQueryOptions<JobCardScheduledTime[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.jobCardScheduledTime.list(params),
    queryFn: () => apiGet<JobCardScheduledTime[]>(`/job-card-scheduled-time${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Job Card Scheduled Time by ID.
 */
export function useJobCardScheduledTime(
  id: string | undefined,
  options?: Omit<UseQueryOptions<JobCardScheduledTime | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.jobCardScheduledTime.detail(id ?? ''),
    queryFn: () => apiGet<JobCardScheduledTime | null>(`/job-card-scheduled-time/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Job Card Scheduled Time.
 * Automatically invalidates list queries on success.
 */
export function useCreateJobCardScheduledTime(
  options?: UseMutationOptions<JobCardScheduledTime, Error, Partial<JobCardScheduledTime>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<JobCardScheduledTime>) => apiPost<JobCardScheduledTime>('/job-card-scheduled-time', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobCardScheduledTime.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Job Card Scheduled Time.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateJobCardScheduledTime(
  options?: UseMutationOptions<JobCardScheduledTime, Error, { id: string; data: Partial<JobCardScheduledTime> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<JobCardScheduledTime> }) =>
      apiPut<JobCardScheduledTime>(`/job-card-scheduled-time/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobCardScheduledTime.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobCardScheduledTime.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Job Card Scheduled Time by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteJobCardScheduledTime(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/job-card-scheduled-time/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobCardScheduledTime.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
