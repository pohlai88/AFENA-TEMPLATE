// TanStack Query hooks for Project Type
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ProjectType } from '../types/project-type.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ProjectTypeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Project Type records.
 */
export function useProjectTypeList(
  params: ProjectTypeListParams = {},
  options?: Omit<UseQueryOptions<ProjectType[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.projectType.list(params),
    queryFn: () => apiGet<ProjectType[]>(`/project-type${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Project Type by ID.
 */
export function useProjectType(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ProjectType | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.projectType.detail(id ?? ''),
    queryFn: () => apiGet<ProjectType | null>(`/project-type/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Project Type.
 * Automatically invalidates list queries on success.
 */
export function useCreateProjectType(
  options?: UseMutationOptions<ProjectType, Error, Partial<ProjectType>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProjectType>) => apiPost<ProjectType>('/project-type', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projectType.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Project Type.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateProjectType(
  options?: UseMutationOptions<ProjectType, Error, { id: string; data: Partial<ProjectType> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProjectType> }) =>
      apiPut<ProjectType>(`/project-type/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projectType.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.projectType.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Project Type by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteProjectType(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/project-type/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projectType.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
