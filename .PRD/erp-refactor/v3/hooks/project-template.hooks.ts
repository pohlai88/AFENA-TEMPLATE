// TanStack Query hooks for Project Template
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ProjectTemplate } from '../types/project-template.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ProjectTemplateListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Project Template records.
 */
export function useProjectTemplateList(
  params: ProjectTemplateListParams = {},
  options?: Omit<UseQueryOptions<ProjectTemplate[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.projectTemplate.list(params),
    queryFn: () => apiGet<ProjectTemplate[]>(`/project-template${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Project Template by ID.
 */
export function useProjectTemplate(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ProjectTemplate | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.projectTemplate.detail(id ?? ''),
    queryFn: () => apiGet<ProjectTemplate | null>(`/project-template/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Project Template.
 * Automatically invalidates list queries on success.
 */
export function useCreateProjectTemplate(
  options?: UseMutationOptions<ProjectTemplate, Error, Partial<ProjectTemplate>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProjectTemplate>) => apiPost<ProjectTemplate>('/project-template', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projectTemplate.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Project Template.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateProjectTemplate(
  options?: UseMutationOptions<ProjectTemplate, Error, { id: string; data: Partial<ProjectTemplate> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProjectTemplate> }) =>
      apiPut<ProjectTemplate>(`/project-template/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projectTemplate.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.projectTemplate.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Project Template by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteProjectTemplate(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/project-template/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projectTemplate.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
