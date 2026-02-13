// TanStack Query hooks for Employee Group Table
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { EmployeeGroupTable } from '../types/employee-group-table.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface EmployeeGroupTableListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Employee Group Table records.
 */
export function useEmployeeGroupTableList(
  params: EmployeeGroupTableListParams = {},
  options?: Omit<UseQueryOptions<EmployeeGroupTable[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.employeeGroupTable.list(params),
    queryFn: () => apiGet<EmployeeGroupTable[]>(`/employee-group-table${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Employee Group Table by ID.
 */
export function useEmployeeGroupTable(
  id: string | undefined,
  options?: Omit<UseQueryOptions<EmployeeGroupTable | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.employeeGroupTable.detail(id ?? ''),
    queryFn: () => apiGet<EmployeeGroupTable | null>(`/employee-group-table/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Employee Group Table.
 * Automatically invalidates list queries on success.
 */
export function useCreateEmployeeGroupTable(
  options?: UseMutationOptions<EmployeeGroupTable, Error, Partial<EmployeeGroupTable>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<EmployeeGroupTable>) => apiPost<EmployeeGroupTable>('/employee-group-table', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employeeGroupTable.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Employee Group Table.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateEmployeeGroupTable(
  options?: UseMutationOptions<EmployeeGroupTable, Error, { id: string; data: Partial<EmployeeGroupTable> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EmployeeGroupTable> }) =>
      apiPut<EmployeeGroupTable>(`/employee-group-table/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employeeGroupTable.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.employeeGroupTable.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Employee Group Table by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteEmployeeGroupTable(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/employee-group-table/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employeeGroupTable.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
