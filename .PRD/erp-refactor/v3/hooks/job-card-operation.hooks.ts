// TanStack Query hooks for Job Card Operation
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { JobCardOperation } from '../types/job-card-operation.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface JobCardOperationListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Job Card Operation records.
 */
export function useJobCardOperationList(
  params: JobCardOperationListParams = {},
  options?: Omit<UseQueryOptions<JobCardOperation[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.jobCardOperation.list(params),
    queryFn: () => apiGet<JobCardOperation[]>(`/job-card-operation${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Job Card Operation by ID.
 */
export function useJobCardOperation(
  id: string | undefined,
  options?: Omit<UseQueryOptions<JobCardOperation | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.jobCardOperation.detail(id ?? ''),
    queryFn: () => apiGet<JobCardOperation | null>(`/job-card-operation/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Job Card Operation.
 * Automatically invalidates list queries on success.
 */
export function useCreateJobCardOperation(
  options?: UseMutationOptions<JobCardOperation, Error, Partial<JobCardOperation>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<JobCardOperation>) => apiPost<JobCardOperation>('/job-card-operation', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobCardOperation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Job Card Operation.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateJobCardOperation(
  options?: UseMutationOptions<JobCardOperation, Error, { id: string; data: Partial<JobCardOperation> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<JobCardOperation> }) =>
      apiPut<JobCardOperation>(`/job-card-operation/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobCardOperation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobCardOperation.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Job Card Operation by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteJobCardOperation(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/job-card-operation/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobCardOperation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
