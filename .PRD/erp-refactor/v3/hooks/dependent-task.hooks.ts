// TanStack Query hooks for Dependent Task
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { DependentTask } from '../types/dependent-task.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface DependentTaskListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Dependent Task records.
 */
export function useDependentTaskList(
  params: DependentTaskListParams = {},
  options?: Omit<UseQueryOptions<DependentTask[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.dependentTask.list(params),
    queryFn: () => apiGet<DependentTask[]>(`/dependent-task${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Dependent Task by ID.
 */
export function useDependentTask(
  id: string | undefined,
  options?: Omit<UseQueryOptions<DependentTask | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.dependentTask.detail(id ?? ''),
    queryFn: () => apiGet<DependentTask | null>(`/dependent-task/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Dependent Task.
 * Automatically invalidates list queries on success.
 */
export function useCreateDependentTask(
  options?: UseMutationOptions<DependentTask, Error, Partial<DependentTask>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<DependentTask>) => apiPost<DependentTask>('/dependent-task', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dependentTask.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Dependent Task.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateDependentTask(
  options?: UseMutationOptions<DependentTask, Error, { id: string; data: Partial<DependentTask> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DependentTask> }) =>
      apiPut<DependentTask>(`/dependent-task/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dependentTask.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dependentTask.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Dependent Task by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteDependentTask(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/dependent-task/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dependentTask.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
