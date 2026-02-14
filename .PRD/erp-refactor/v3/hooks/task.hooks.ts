// TanStack Query hooks for Task
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Task } from '../types/task.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface TaskListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Task records.
 */
export function useTaskList(
  params: TaskListParams = {},
  options?: Omit<UseQueryOptions<Task[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.task.list(params),
    queryFn: () => apiGet<Task[]>(`/task${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Task by ID.
 */
export function useTask(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Task | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.task.detail(id ?? ''),
    queryFn: () => apiGet<Task | null>(`/task/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Task.
 * Automatically invalidates list queries on success.
 */
export function useCreateTask(
  options?: UseMutationOptions<Task, Error, Partial<Task>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Task>) => apiPost<Task>('/task', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.task.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Task.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateTask(
  options?: UseMutationOptions<Task, Error, { id: string; data: Partial<Task> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) =>
      apiPut<Task>(`/task/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.task.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.task.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Task by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteTask(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/task/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.task.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
