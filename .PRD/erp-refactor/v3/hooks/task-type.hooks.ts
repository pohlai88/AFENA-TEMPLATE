// TanStack Query hooks for Task Type
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { TaskType } from '../types/task-type.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface TaskTypeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Task Type records.
 */
export function useTaskTypeList(
  params: TaskTypeListParams = {},
  options?: Omit<UseQueryOptions<TaskType[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.taskType.list(params),
    queryFn: () => apiGet<TaskType[]>(`/task-type${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Task Type by ID.
 */
export function useTaskType(
  id: string | undefined,
  options?: Omit<UseQueryOptions<TaskType | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.taskType.detail(id ?? ''),
    queryFn: () => apiGet<TaskType | null>(`/task-type/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Task Type.
 * Automatically invalidates list queries on success.
 */
export function useCreateTaskType(
  options?: UseMutationOptions<TaskType, Error, Partial<TaskType>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<TaskType>) => apiPost<TaskType>('/task-type', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taskType.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Task Type.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateTaskType(
  options?: UseMutationOptions<TaskType, Error, { id: string; data: Partial<TaskType> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TaskType> }) =>
      apiPut<TaskType>(`/task-type/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taskType.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.taskType.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Task Type by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteTaskType(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/task-type/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taskType.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
