// TanStack Query hooks for Branch
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Branch } from '../types/branch.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BranchListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Branch records.
 */
export function useBranchList(
  params: BranchListParams = {},
  options?: Omit<UseQueryOptions<Branch[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.branch.list(params),
    queryFn: () => apiGet<Branch[]>(`/branch${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Branch by ID.
 */
export function useBranch(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Branch | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.branch.detail(id ?? ''),
    queryFn: () => apiGet<Branch | null>(`/branch/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Branch.
 * Automatically invalidates list queries on success.
 */
export function useCreateBranch(
  options?: UseMutationOptions<Branch, Error, Partial<Branch>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Branch>) => apiPost<Branch>('/branch', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.branch.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Branch.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBranch(
  options?: UseMutationOptions<Branch, Error, { id: string; data: Partial<Branch> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Branch> }) =>
      apiPut<Branch>(`/branch/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.branch.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.branch.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Branch by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBranch(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/branch/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.branch.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
