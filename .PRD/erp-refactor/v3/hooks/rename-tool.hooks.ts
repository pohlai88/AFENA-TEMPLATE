// TanStack Query hooks for Rename Tool
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { RenameTool } from '../types/rename-tool.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface RenameToolListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Rename Tool records.
 */
export function useRenameToolList(
  params: RenameToolListParams = {},
  options?: Omit<UseQueryOptions<RenameTool[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.renameTool.list(params),
    queryFn: () => apiGet<RenameTool[]>(`/rename-tool${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Rename Tool by ID.
 */
export function useRenameTool(
  id: string | undefined,
  options?: Omit<UseQueryOptions<RenameTool | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.renameTool.detail(id ?? ''),
    queryFn: () => apiGet<RenameTool | null>(`/rename-tool/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Rename Tool.
 * Automatically invalidates list queries on success.
 */
export function useCreateRenameTool(
  options?: UseMutationOptions<RenameTool, Error, Partial<RenameTool>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<RenameTool>) => apiPost<RenameTool>('/rename-tool', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.renameTool.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Rename Tool.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateRenameTool(
  options?: UseMutationOptions<RenameTool, Error, { id: string; data: Partial<RenameTool> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RenameTool> }) =>
      apiPut<RenameTool>(`/rename-tool/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.renameTool.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.renameTool.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Rename Tool by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteRenameTool(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/rename-tool/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.renameTool.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
