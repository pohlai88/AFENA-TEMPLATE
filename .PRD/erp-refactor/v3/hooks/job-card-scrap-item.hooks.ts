// TanStack Query hooks for Job Card Scrap Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { JobCardScrapItem } from '../types/job-card-scrap-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface JobCardScrapItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Job Card Scrap Item records.
 */
export function useJobCardScrapItemList(
  params: JobCardScrapItemListParams = {},
  options?: Omit<UseQueryOptions<JobCardScrapItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.jobCardScrapItem.list(params),
    queryFn: () => apiGet<JobCardScrapItem[]>(`/job-card-scrap-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Job Card Scrap Item by ID.
 */
export function useJobCardScrapItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<JobCardScrapItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.jobCardScrapItem.detail(id ?? ''),
    queryFn: () => apiGet<JobCardScrapItem | null>(`/job-card-scrap-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Job Card Scrap Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateJobCardScrapItem(
  options?: UseMutationOptions<JobCardScrapItem, Error, Partial<JobCardScrapItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<JobCardScrapItem>) => apiPost<JobCardScrapItem>('/job-card-scrap-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobCardScrapItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Job Card Scrap Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateJobCardScrapItem(
  options?: UseMutationOptions<JobCardScrapItem, Error, { id: string; data: Partial<JobCardScrapItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<JobCardScrapItem> }) =>
      apiPut<JobCardScrapItem>(`/job-card-scrap-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobCardScrapItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobCardScrapItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Job Card Scrap Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteJobCardScrapItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/job-card-scrap-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobCardScrapItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
