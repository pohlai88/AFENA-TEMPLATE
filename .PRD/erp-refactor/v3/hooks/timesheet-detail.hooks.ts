// TanStack Query hooks for Timesheet Detail
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { TimesheetDetail } from '../types/timesheet-detail.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface TimesheetDetailListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Timesheet Detail records.
 */
export function useTimesheetDetailList(
  params: TimesheetDetailListParams = {},
  options?: Omit<UseQueryOptions<TimesheetDetail[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.timesheetDetail.list(params),
    queryFn: () => apiGet<TimesheetDetail[]>(`/timesheet-detail${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Timesheet Detail by ID.
 */
export function useTimesheetDetail(
  id: string | undefined,
  options?: Omit<UseQueryOptions<TimesheetDetail | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.timesheetDetail.detail(id ?? ''),
    queryFn: () => apiGet<TimesheetDetail | null>(`/timesheet-detail/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Timesheet Detail.
 * Automatically invalidates list queries on success.
 */
export function useCreateTimesheetDetail(
  options?: UseMutationOptions<TimesheetDetail, Error, Partial<TimesheetDetail>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<TimesheetDetail>) => apiPost<TimesheetDetail>('/timesheet-detail', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.timesheetDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Timesheet Detail.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateTimesheetDetail(
  options?: UseMutationOptions<TimesheetDetail, Error, { id: string; data: Partial<TimesheetDetail> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TimesheetDetail> }) =>
      apiPut<TimesheetDetail>(`/timesheet-detail/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.timesheetDetail.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.timesheetDetail.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Timesheet Detail by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteTimesheetDetail(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/timesheet-detail/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.timesheetDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
