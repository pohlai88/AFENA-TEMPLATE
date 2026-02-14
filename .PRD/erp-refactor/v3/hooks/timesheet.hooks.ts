// TanStack Query hooks for Timesheet
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Timesheet } from '../types/timesheet.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface TimesheetListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Timesheet records.
 */
export function useTimesheetList(
  params: TimesheetListParams = {},
  options?: Omit<UseQueryOptions<Timesheet[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.timesheet.list(params),
    queryFn: () => apiGet<Timesheet[]>(`/timesheet${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Timesheet by ID.
 */
export function useTimesheet(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Timesheet | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.timesheet.detail(id ?? ''),
    queryFn: () => apiGet<Timesheet | null>(`/timesheet/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Timesheet.
 * Automatically invalidates list queries on success.
 */
export function useCreateTimesheet(
  options?: UseMutationOptions<Timesheet, Error, Partial<Timesheet>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Timesheet>) => apiPost<Timesheet>('/timesheet', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.timesheet.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Timesheet.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateTimesheet(
  options?: UseMutationOptions<Timesheet, Error, { id: string; data: Partial<Timesheet> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Timesheet> }) =>
      apiPut<Timesheet>(`/timesheet/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.timesheet.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.timesheet.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Timesheet by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteTimesheet(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/timesheet/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.timesheet.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Timesheet (set docstatus = 1).
 */
export function useSubmitTimesheet(
  options?: UseMutationOptions<Timesheet, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<Timesheet>(`/timesheet/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.timesheet.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.timesheet.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Timesheet (set docstatus = 2).
 */
export function useCancelTimesheet(
  options?: UseMutationOptions<Timesheet, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<Timesheet>(`/timesheet/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.timesheet.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.timesheet.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
