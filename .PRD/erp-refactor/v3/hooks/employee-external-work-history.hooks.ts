// TanStack Query hooks for Employee External Work History
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { EmployeeExternalWorkHistory } from '../types/employee-external-work-history.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface EmployeeExternalWorkHistoryListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Employee External Work History records.
 */
export function useEmployeeExternalWorkHistoryList(
  params: EmployeeExternalWorkHistoryListParams = {},
  options?: Omit<UseQueryOptions<EmployeeExternalWorkHistory[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.employeeExternalWorkHistory.list(params),
    queryFn: () => apiGet<EmployeeExternalWorkHistory[]>(`/employee-external-work-history${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Employee External Work History by ID.
 */
export function useEmployeeExternalWorkHistory(
  id: string | undefined,
  options?: Omit<UseQueryOptions<EmployeeExternalWorkHistory | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.employeeExternalWorkHistory.detail(id ?? ''),
    queryFn: () => apiGet<EmployeeExternalWorkHistory | null>(`/employee-external-work-history/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Employee External Work History.
 * Automatically invalidates list queries on success.
 */
export function useCreateEmployeeExternalWorkHistory(
  options?: UseMutationOptions<EmployeeExternalWorkHistory, Error, Partial<EmployeeExternalWorkHistory>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<EmployeeExternalWorkHistory>) => apiPost<EmployeeExternalWorkHistory>('/employee-external-work-history', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employeeExternalWorkHistory.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Employee External Work History.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateEmployeeExternalWorkHistory(
  options?: UseMutationOptions<EmployeeExternalWorkHistory, Error, { id: string; data: Partial<EmployeeExternalWorkHistory> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EmployeeExternalWorkHistory> }) =>
      apiPut<EmployeeExternalWorkHistory>(`/employee-external-work-history/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employeeExternalWorkHistory.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.employeeExternalWorkHistory.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Employee External Work History by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteEmployeeExternalWorkHistory(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/employee-external-work-history/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employeeExternalWorkHistory.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
