// TanStack Query hooks for Code List
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { CodeList } from '../types/code-list.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface CodeListListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Code List records.
 */
export function useCodeListList(
  params: CodeListListParams = {},
  options?: Omit<UseQueryOptions<CodeList[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.codeList.list(params),
    queryFn: () => apiGet<CodeList[]>(`/code-list${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Code List by ID.
 */
export function useCodeList(
  id: string | undefined,
  options?: Omit<UseQueryOptions<CodeList | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.codeList.detail(id ?? ''),
    queryFn: () => apiGet<CodeList | null>(`/code-list/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Code List.
 * Automatically invalidates list queries on success.
 */
export function useCreateCodeList(
  options?: UseMutationOptions<CodeList, Error, Partial<CodeList>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CodeList>) => apiPost<CodeList>('/code-list', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.codeList.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Code List.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateCodeList(
  options?: UseMutationOptions<CodeList, Error, { id: string; data: Partial<CodeList> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CodeList> }) =>
      apiPut<CodeList>(`/code-list/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.codeList.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.codeList.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Code List by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteCodeList(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/code-list/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.codeList.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
