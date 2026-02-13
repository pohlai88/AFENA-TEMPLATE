// TanStack Query hooks for Issue Type
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { IssueType } from '../types/issue-type.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface IssueTypeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Issue Type records.
 */
export function useIssueTypeList(
  params: IssueTypeListParams = {},
  options?: Omit<UseQueryOptions<IssueType[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.issueType.list(params),
    queryFn: () => apiGet<IssueType[]>(`/issue-type${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Issue Type by ID.
 */
export function useIssueType(
  id: string | undefined,
  options?: Omit<UseQueryOptions<IssueType | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.issueType.detail(id ?? ''),
    queryFn: () => apiGet<IssueType | null>(`/issue-type/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Issue Type.
 * Automatically invalidates list queries on success.
 */
export function useCreateIssueType(
  options?: UseMutationOptions<IssueType, Error, Partial<IssueType>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<IssueType>) => apiPost<IssueType>('/issue-type', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issueType.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Issue Type.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateIssueType(
  options?: UseMutationOptions<IssueType, Error, { id: string; data: Partial<IssueType> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IssueType> }) =>
      apiPut<IssueType>(`/issue-type/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issueType.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.issueType.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Issue Type by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteIssueType(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/issue-type/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issueType.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
