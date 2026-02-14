// TanStack Query hooks for Job Card Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { JobCardItem } from '../types/job-card-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface JobCardItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Job Card Item records.
 */
export function useJobCardItemList(
  params: JobCardItemListParams = {},
  options?: Omit<UseQueryOptions<JobCardItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.jobCardItem.list(params),
    queryFn: () => apiGet<JobCardItem[]>(`/job-card-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Job Card Item by ID.
 */
export function useJobCardItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<JobCardItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.jobCardItem.detail(id ?? ''),
    queryFn: () => apiGet<JobCardItem | null>(`/job-card-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Job Card Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateJobCardItem(
  options?: UseMutationOptions<JobCardItem, Error, Partial<JobCardItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<JobCardItem>) => apiPost<JobCardItem>('/job-card-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobCardItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Job Card Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateJobCardItem(
  options?: UseMutationOptions<JobCardItem, Error, { id: string; data: Partial<JobCardItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<JobCardItem> }) =>
      apiPut<JobCardItem>(`/job-card-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobCardItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobCardItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Job Card Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteJobCardItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/job-card-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobCardItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
