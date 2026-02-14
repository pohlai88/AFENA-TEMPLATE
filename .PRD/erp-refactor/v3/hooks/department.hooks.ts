// TanStack Query hooks for Department
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Department } from '../types/department.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface DepartmentListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Department records.
 */
export function useDepartmentList(
  params: DepartmentListParams = {},
  options?: Omit<UseQueryOptions<Department[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.department.list(params),
    queryFn: () => apiGet<Department[]>(`/department${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Department by ID.
 */
export function useDepartment(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Department | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.department.detail(id ?? ''),
    queryFn: () => apiGet<Department | null>(`/department/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Department.
 * Automatically invalidates list queries on success.
 */
export function useCreateDepartment(
  options?: UseMutationOptions<Department, Error, Partial<Department>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Department>) => apiPost<Department>('/department', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.department.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Department.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateDepartment(
  options?: UseMutationOptions<Department, Error, { id: string; data: Partial<Department> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Department> }) =>
      apiPut<Department>(`/department/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.department.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.department.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Department by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteDepartment(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/department/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.department.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
