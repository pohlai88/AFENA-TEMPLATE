// TanStack Query hooks for Task Depends On
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { TaskDependsOn } from '../types/task-depends-on.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface TaskDependsOnListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Task Depends On records.
 */
export function useTaskDependsOnList(
  params: TaskDependsOnListParams = {},
  options?: Omit<UseQueryOptions<TaskDependsOn[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.taskDependsOn.list(params),
    queryFn: () => apiGet<TaskDependsOn[]>(`/task-depends-on${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Task Depends On by ID.
 */
export function useTaskDependsOn(
  id: string | undefined,
  options?: Omit<UseQueryOptions<TaskDependsOn | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.taskDependsOn.detail(id ?? ''),
    queryFn: () => apiGet<TaskDependsOn | null>(`/task-depends-on/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Task Depends On.
 * Automatically invalidates list queries on success.
 */
export function useCreateTaskDependsOn(
  options?: UseMutationOptions<TaskDependsOn, Error, Partial<TaskDependsOn>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<TaskDependsOn>) => apiPost<TaskDependsOn>('/task-depends-on', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taskDependsOn.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Task Depends On.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateTaskDependsOn(
  options?: UseMutationOptions<TaskDependsOn, Error, { id: string; data: Partial<TaskDependsOn> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TaskDependsOn> }) =>
      apiPut<TaskDependsOn>(`/task-depends-on/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taskDependsOn.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.taskDependsOn.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Task Depends On by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteTaskDependsOn(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/task-depends-on/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taskDependsOn.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
