// TanStack Query hooks for Issue
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Issue } from '../types/issue.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface IssueListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Issue records.
 */
export function useIssueList(
  params: IssueListParams = {},
  options?: Omit<UseQueryOptions<Issue[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.issue.list(params),
    queryFn: () => apiGet<Issue[]>(`/issue${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Issue by ID.
 */
export function useIssue(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Issue | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.issue.detail(id ?? ''),
    queryFn: () => apiGet<Issue | null>(`/issue/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Issue.
 * Automatically invalidates list queries on success.
 */
export function useCreateIssue(
  options?: UseMutationOptions<Issue, Error, Partial<Issue>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Issue>) => apiPost<Issue>('/issue', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issue.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Issue.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateIssue(
  options?: UseMutationOptions<Issue, Error, { id: string; data: Partial<Issue> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Issue> }) =>
      apiPut<Issue>(`/issue/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issue.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.issue.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Issue by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteIssue(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/issue/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issue.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
