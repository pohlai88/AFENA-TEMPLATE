// TanStack Query hooks for Project Template Task
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ProjectTemplateTask } from '../types/project-template-task.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ProjectTemplateTaskListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Project Template Task records.
 */
export function useProjectTemplateTaskList(
  params: ProjectTemplateTaskListParams = {},
  options?: Omit<UseQueryOptions<ProjectTemplateTask[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.projectTemplateTask.list(params),
    queryFn: () => apiGet<ProjectTemplateTask[]>(`/project-template-task${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Project Template Task by ID.
 */
export function useProjectTemplateTask(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ProjectTemplateTask | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.projectTemplateTask.detail(id ?? ''),
    queryFn: () => apiGet<ProjectTemplateTask | null>(`/project-template-task/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Project Template Task.
 * Automatically invalidates list queries on success.
 */
export function useCreateProjectTemplateTask(
  options?: UseMutationOptions<ProjectTemplateTask, Error, Partial<ProjectTemplateTask>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProjectTemplateTask>) => apiPost<ProjectTemplateTask>('/project-template-task', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projectTemplateTask.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Project Template Task.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateProjectTemplateTask(
  options?: UseMutationOptions<ProjectTemplateTask, Error, { id: string; data: Partial<ProjectTemplateTask> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProjectTemplateTask> }) =>
      apiPut<ProjectTemplateTask>(`/project-template-task/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projectTemplateTask.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.projectTemplateTask.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Project Template Task by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteProjectTemplateTask(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/project-template-task/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projectTemplateTask.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
