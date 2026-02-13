// TanStack Query hooks for PSOA Project
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PsoaProject } from '../types/psoa-project.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PsoaProjectListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of PSOA Project records.
 */
export function usePsoaProjectList(
  params: PsoaProjectListParams = {},
  options?: Omit<UseQueryOptions<PsoaProject[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.psoaProject.list(params),
    queryFn: () => apiGet<PsoaProject[]>(`/psoa-project${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single PSOA Project by ID.
 */
export function usePsoaProject(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PsoaProject | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.psoaProject.detail(id ?? ''),
    queryFn: () => apiGet<PsoaProject | null>(`/psoa-project/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new PSOA Project.
 * Automatically invalidates list queries on success.
 */
export function useCreatePsoaProject(
  options?: UseMutationOptions<PsoaProject, Error, Partial<PsoaProject>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PsoaProject>) => apiPost<PsoaProject>('/psoa-project', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.psoaProject.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing PSOA Project.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePsoaProject(
  options?: UseMutationOptions<PsoaProject, Error, { id: string; data: Partial<PsoaProject> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PsoaProject> }) =>
      apiPut<PsoaProject>(`/psoa-project/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.psoaProject.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.psoaProject.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a PSOA Project by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePsoaProject(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/psoa-project/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.psoaProject.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
