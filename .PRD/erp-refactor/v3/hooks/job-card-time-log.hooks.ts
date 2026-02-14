// TanStack Query hooks for Job Card Time Log
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { JobCardTimeLog } from '../types/job-card-time-log.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface JobCardTimeLogListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Job Card Time Log records.
 */
export function useJobCardTimeLogList(
  params: JobCardTimeLogListParams = {},
  options?: Omit<UseQueryOptions<JobCardTimeLog[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.jobCardTimeLog.list(params),
    queryFn: () => apiGet<JobCardTimeLog[]>(`/job-card-time-log${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Job Card Time Log by ID.
 */
export function useJobCardTimeLog(
  id: string | undefined,
  options?: Omit<UseQueryOptions<JobCardTimeLog | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.jobCardTimeLog.detail(id ?? ''),
    queryFn: () => apiGet<JobCardTimeLog | null>(`/job-card-time-log/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Job Card Time Log.
 * Automatically invalidates list queries on success.
 */
export function useCreateJobCardTimeLog(
  options?: UseMutationOptions<JobCardTimeLog, Error, Partial<JobCardTimeLog>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<JobCardTimeLog>) => apiPost<JobCardTimeLog>('/job-card-time-log', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobCardTimeLog.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Job Card Time Log.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateJobCardTimeLog(
  options?: UseMutationOptions<JobCardTimeLog, Error, { id: string; data: Partial<JobCardTimeLog> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<JobCardTimeLog> }) =>
      apiPut<JobCardTimeLog>(`/job-card-time-log/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobCardTimeLog.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobCardTimeLog.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Job Card Time Log by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteJobCardTimeLog(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/job-card-time-log/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobCardTimeLog.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
