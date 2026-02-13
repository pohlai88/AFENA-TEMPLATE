// TanStack Query hooks for Project User
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ProjectUser } from '../types/project-user.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ProjectUserListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Project User records.
 */
export function useProjectUserList(
  params: ProjectUserListParams = {},
  options?: Omit<UseQueryOptions<ProjectUser[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.projectUser.list(params),
    queryFn: () => apiGet<ProjectUser[]>(`/project-user${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Project User by ID.
 */
export function useProjectUser(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ProjectUser | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.projectUser.detail(id ?? ''),
    queryFn: () => apiGet<ProjectUser | null>(`/project-user/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Project User.
 * Automatically invalidates list queries on success.
 */
export function useCreateProjectUser(
  options?: UseMutationOptions<ProjectUser, Error, Partial<ProjectUser>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProjectUser>) => apiPost<ProjectUser>('/project-user', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projectUser.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Project User.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateProjectUser(
  options?: UseMutationOptions<ProjectUser, Error, { id: string; data: Partial<ProjectUser> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProjectUser> }) =>
      apiPut<ProjectUser>(`/project-user/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projectUser.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.projectUser.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Project User by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteProjectUser(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/project-user/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projectUser.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
