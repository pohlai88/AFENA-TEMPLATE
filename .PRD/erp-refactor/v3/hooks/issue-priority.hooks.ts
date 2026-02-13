// TanStack Query hooks for Issue Priority
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { IssuePriority } from '../types/issue-priority.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface IssuePriorityListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Issue Priority records.
 */
export function useIssuePriorityList(
  params: IssuePriorityListParams = {},
  options?: Omit<UseQueryOptions<IssuePriority[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.issuePriority.list(params),
    queryFn: () => apiGet<IssuePriority[]>(`/issue-priority${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Issue Priority by ID.
 */
export function useIssuePriority(
  id: string | undefined,
  options?: Omit<UseQueryOptions<IssuePriority | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.issuePriority.detail(id ?? ''),
    queryFn: () => apiGet<IssuePriority | null>(`/issue-priority/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Issue Priority.
 * Automatically invalidates list queries on success.
 */
export function useCreateIssuePriority(
  options?: UseMutationOptions<IssuePriority, Error, Partial<IssuePriority>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<IssuePriority>) => apiPost<IssuePriority>('/issue-priority', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issuePriority.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Issue Priority.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateIssuePriority(
  options?: UseMutationOptions<IssuePriority, Error, { id: string; data: Partial<IssuePriority> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IssuePriority> }) =>
      apiPut<IssuePriority>(`/issue-priority/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issuePriority.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.issuePriority.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Issue Priority by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteIssuePriority(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/issue-priority/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issuePriority.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
