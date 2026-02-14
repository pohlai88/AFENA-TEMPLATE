// TanStack Query hooks for Employee Education
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { EmployeeEducation } from '../types/employee-education.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface EmployeeEducationListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Employee Education records.
 */
export function useEmployeeEducationList(
  params: EmployeeEducationListParams = {},
  options?: Omit<UseQueryOptions<EmployeeEducation[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.employeeEducation.list(params),
    queryFn: () => apiGet<EmployeeEducation[]>(`/employee-education${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Employee Education by ID.
 */
export function useEmployeeEducation(
  id: string | undefined,
  options?: Omit<UseQueryOptions<EmployeeEducation | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.employeeEducation.detail(id ?? ''),
    queryFn: () => apiGet<EmployeeEducation | null>(`/employee-education/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Employee Education.
 * Automatically invalidates list queries on success.
 */
export function useCreateEmployeeEducation(
  options?: UseMutationOptions<EmployeeEducation, Error, Partial<EmployeeEducation>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<EmployeeEducation>) => apiPost<EmployeeEducation>('/employee-education', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employeeEducation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Employee Education.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateEmployeeEducation(
  options?: UseMutationOptions<EmployeeEducation, Error, { id: string; data: Partial<EmployeeEducation> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EmployeeEducation> }) =>
      apiPut<EmployeeEducation>(`/employee-education/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employeeEducation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.employeeEducation.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Employee Education by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteEmployeeEducation(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/employee-education/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employeeEducation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
