// TanStack Query hooks for Employee
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Employee } from '../types/employee.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface EmployeeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Employee records.
 */
export function useEmployeeList(
  params: EmployeeListParams = {},
  options?: Omit<UseQueryOptions<Employee[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.employee.list(params),
    queryFn: () => apiGet<Employee[]>(`/employee${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Employee by ID.
 */
export function useEmployee(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Employee | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.employee.detail(id ?? ''),
    queryFn: () => apiGet<Employee | null>(`/employee/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Employee.
 * Automatically invalidates list queries on success.
 */
export function useCreateEmployee(
  options?: UseMutationOptions<Employee, Error, Partial<Employee>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Employee>) => apiPost<Employee>('/employee', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employee.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Employee.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateEmployee(
  options?: UseMutationOptions<Employee, Error, { id: string; data: Partial<Employee> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Employee> }) =>
      apiPut<Employee>(`/employee/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employee.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.employee.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Employee by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteEmployee(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/employee/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employee.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
