// TanStack Query hooks for Master Production Schedule
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { MasterProductionSchedule } from '../types/master-production-schedule.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface MasterProductionScheduleListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Master Production Schedule records.
 */
export function useMasterProductionScheduleList(
  params: MasterProductionScheduleListParams = {},
  options?: Omit<UseQueryOptions<MasterProductionSchedule[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.masterProductionSchedule.list(params),
    queryFn: () => apiGet<MasterProductionSchedule[]>(`/master-production-schedule${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Master Production Schedule by ID.
 */
export function useMasterProductionSchedule(
  id: string | undefined,
  options?: Omit<UseQueryOptions<MasterProductionSchedule | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.masterProductionSchedule.detail(id ?? ''),
    queryFn: () => apiGet<MasterProductionSchedule | null>(`/master-production-schedule/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Master Production Schedule.
 * Automatically invalidates list queries on success.
 */
export function useCreateMasterProductionSchedule(
  options?: UseMutationOptions<MasterProductionSchedule, Error, Partial<MasterProductionSchedule>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<MasterProductionSchedule>) => apiPost<MasterProductionSchedule>('/master-production-schedule', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.masterProductionSchedule.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Master Production Schedule.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateMasterProductionSchedule(
  options?: UseMutationOptions<MasterProductionSchedule, Error, { id: string; data: Partial<MasterProductionSchedule> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MasterProductionSchedule> }) =>
      apiPut<MasterProductionSchedule>(`/master-production-schedule/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.masterProductionSchedule.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.masterProductionSchedule.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Master Production Schedule by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteMasterProductionSchedule(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/master-production-schedule/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.masterProductionSchedule.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
