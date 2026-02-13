// TanStack Query hooks for Job Card
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { JobCard } from '../types/job-card.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface JobCardListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Job Card records.
 */
export function useJobCardList(
  params: JobCardListParams = {},
  options?: Omit<UseQueryOptions<JobCard[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.jobCard.list(params),
    queryFn: () => apiGet<JobCard[]>(`/job-card${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Job Card by ID.
 */
export function useJobCard(
  id: string | undefined,
  options?: Omit<UseQueryOptions<JobCard | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.jobCard.detail(id ?? ''),
    queryFn: () => apiGet<JobCard | null>(`/job-card/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Job Card.
 * Automatically invalidates list queries on success.
 */
export function useCreateJobCard(
  options?: UseMutationOptions<JobCard, Error, Partial<JobCard>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<JobCard>) => apiPost<JobCard>('/job-card', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobCard.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Job Card.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateJobCard(
  options?: UseMutationOptions<JobCard, Error, { id: string; data: Partial<JobCard> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<JobCard> }) =>
      apiPut<JobCard>(`/job-card/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobCard.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobCard.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Job Card by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteJobCard(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/job-card/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobCard.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Job Card (set docstatus = 1).
 */
export function useSubmitJobCard(
  options?: UseMutationOptions<JobCard, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<JobCard>(`/job-card/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobCard.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobCard.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Job Card (set docstatus = 2).
 */
export function useCancelJobCard(
  options?: UseMutationOptions<JobCard, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<JobCard>(`/job-card/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobCard.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobCard.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
