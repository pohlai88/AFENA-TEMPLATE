// TanStack Query hooks for Project
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Project } from '../types/project.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ProjectListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Project records.
 */
export function useProjectList(
  params: ProjectListParams = {},
  options?: Omit<UseQueryOptions<Project[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.project.list(params),
    queryFn: () => apiGet<Project[]>(`/project${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Project by ID.
 */
export function useProject(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Project | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.project.detail(id ?? ''),
    queryFn: () => apiGet<Project | null>(`/project/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Project.
 * Automatically invalidates list queries on success.
 */
export function useCreateProject(
  options?: UseMutationOptions<Project, Error, Partial<Project>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Project>) => apiPost<Project>('/project', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.project.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Project.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateProject(
  options?: UseMutationOptions<Project, Error, { id: string; data: Partial<Project> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
      apiPut<Project>(`/project/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.project.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.project.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Project by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteProject(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/project/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.project.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
