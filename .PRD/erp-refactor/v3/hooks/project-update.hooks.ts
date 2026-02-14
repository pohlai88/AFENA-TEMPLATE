// TanStack Query hooks for Project Update
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ProjectUpdate } from '../types/project-update.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ProjectUpdateListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Project Update records.
 */
export function useProjectUpdateList(
  params: ProjectUpdateListParams = {},
  options?: Omit<UseQueryOptions<ProjectUpdate[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.projectUpdate.list(params),
    queryFn: () => apiGet<ProjectUpdate[]>(`/project-update${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Project Update by ID.
 */
export function useProjectUpdate(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ProjectUpdate | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.projectUpdate.detail(id ?? ''),
    queryFn: () => apiGet<ProjectUpdate | null>(`/project-update/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Project Update.
 * Automatically invalidates list queries on success.
 */
export function useCreateProjectUpdate(
  options?: UseMutationOptions<ProjectUpdate, Error, Partial<ProjectUpdate>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProjectUpdate>) => apiPost<ProjectUpdate>('/project-update', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projectUpdate.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Project Update.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateProjectUpdate(
  options?: UseMutationOptions<ProjectUpdate, Error, { id: string; data: Partial<ProjectUpdate> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProjectUpdate> }) =>
      apiPut<ProjectUpdate>(`/project-update/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projectUpdate.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.projectUpdate.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Project Update by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteProjectUpdate(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/project-update/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projectUpdate.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Project Update (set docstatus = 1).
 */
export function useSubmitProjectUpdate(
  options?: UseMutationOptions<ProjectUpdate, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<ProjectUpdate>(`/project-update/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projectUpdate.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.projectUpdate.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Project Update (set docstatus = 2).
 */
export function useCancelProjectUpdate(
  options?: UseMutationOptions<ProjectUpdate, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<ProjectUpdate>(`/project-update/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projectUpdate.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.projectUpdate.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
