// TanStack Query hooks for Employee Internal Work History
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { EmployeeInternalWorkHistory } from '../types/employee-internal-work-history.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface EmployeeInternalWorkHistoryListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Employee Internal Work History records.
 */
export function useEmployeeInternalWorkHistoryList(
  params: EmployeeInternalWorkHistoryListParams = {},
  options?: Omit<UseQueryOptions<EmployeeInternalWorkHistory[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.employeeInternalWorkHistory.list(params),
    queryFn: () => apiGet<EmployeeInternalWorkHistory[]>(`/employee-internal-work-history${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Employee Internal Work History by ID.
 */
export function useEmployeeInternalWorkHistory(
  id: string | undefined,
  options?: Omit<UseQueryOptions<EmployeeInternalWorkHistory | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.employeeInternalWorkHistory.detail(id ?? ''),
    queryFn: () => apiGet<EmployeeInternalWorkHistory | null>(`/employee-internal-work-history/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Employee Internal Work History.
 * Automatically invalidates list queries on success.
 */
export function useCreateEmployeeInternalWorkHistory(
  options?: UseMutationOptions<EmployeeInternalWorkHistory, Error, Partial<EmployeeInternalWorkHistory>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<EmployeeInternalWorkHistory>) => apiPost<EmployeeInternalWorkHistory>('/employee-internal-work-history', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employeeInternalWorkHistory.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Employee Internal Work History.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateEmployeeInternalWorkHistory(
  options?: UseMutationOptions<EmployeeInternalWorkHistory, Error, { id: string; data: Partial<EmployeeInternalWorkHistory> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EmployeeInternalWorkHistory> }) =>
      apiPut<EmployeeInternalWorkHistory>(`/employee-internal-work-history/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employeeInternalWorkHistory.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.employeeInternalWorkHistory.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Employee Internal Work History by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteEmployeeInternalWorkHistory(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/employee-internal-work-history/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employeeInternalWorkHistory.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
