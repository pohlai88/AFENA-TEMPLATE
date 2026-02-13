// TanStack Query hooks for Depreciation Schedule
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { DepreciationSchedule } from '../types/depreciation-schedule.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface DepreciationScheduleListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Depreciation Schedule records.
 */
export function useDepreciationScheduleList(
  params: DepreciationScheduleListParams = {},
  options?: Omit<UseQueryOptions<DepreciationSchedule[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.depreciationSchedule.list(params),
    queryFn: () => apiGet<DepreciationSchedule[]>(`/depreciation-schedule${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Depreciation Schedule by ID.
 */
export function useDepreciationSchedule(
  id: string | undefined,
  options?: Omit<UseQueryOptions<DepreciationSchedule | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.depreciationSchedule.detail(id ?? ''),
    queryFn: () => apiGet<DepreciationSchedule | null>(`/depreciation-schedule/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Depreciation Schedule.
 * Automatically invalidates list queries on success.
 */
export function useCreateDepreciationSchedule(
  options?: UseMutationOptions<DepreciationSchedule, Error, Partial<DepreciationSchedule>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<DepreciationSchedule>) => apiPost<DepreciationSchedule>('/depreciation-schedule', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.depreciationSchedule.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Depreciation Schedule.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateDepreciationSchedule(
  options?: UseMutationOptions<DepreciationSchedule, Error, { id: string; data: Partial<DepreciationSchedule> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DepreciationSchedule> }) =>
      apiPut<DepreciationSchedule>(`/depreciation-schedule/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.depreciationSchedule.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.depreciationSchedule.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Depreciation Schedule by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteDepreciationSchedule(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/depreciation-schedule/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.depreciationSchedule.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
