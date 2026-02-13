// TanStack Query hooks for Employee Group
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { EmployeeGroup } from '../types/employee-group.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface EmployeeGroupListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Employee Group records.
 */
export function useEmployeeGroupList(
  params: EmployeeGroupListParams = {},
  options?: Omit<UseQueryOptions<EmployeeGroup[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.employeeGroup.list(params),
    queryFn: () => apiGet<EmployeeGroup[]>(`/employee-group${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Employee Group by ID.
 */
export function useEmployeeGroup(
  id: string | undefined,
  options?: Omit<UseQueryOptions<EmployeeGroup | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.employeeGroup.detail(id ?? ''),
    queryFn: () => apiGet<EmployeeGroup | null>(`/employee-group/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Employee Group.
 * Automatically invalidates list queries on success.
 */
export function useCreateEmployeeGroup(
  options?: UseMutationOptions<EmployeeGroup, Error, Partial<EmployeeGroup>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<EmployeeGroup>) => apiPost<EmployeeGroup>('/employee-group', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employeeGroup.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Employee Group.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateEmployeeGroup(
  options?: UseMutationOptions<EmployeeGroup, Error, { id: string; data: Partial<EmployeeGroup> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EmployeeGroup> }) =>
      apiPut<EmployeeGroup>(`/employee-group/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employeeGroup.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.employeeGroup.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Employee Group by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteEmployeeGroup(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/employee-group/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employeeGroup.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
