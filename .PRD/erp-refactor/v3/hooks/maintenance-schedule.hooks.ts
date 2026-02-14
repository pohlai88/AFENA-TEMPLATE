// TanStack Query hooks for Maintenance Schedule
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { MaintenanceSchedule } from '../types/maintenance-schedule.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface MaintenanceScheduleListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Maintenance Schedule records.
 */
export function useMaintenanceScheduleList(
  params: MaintenanceScheduleListParams = {},
  options?: Omit<UseQueryOptions<MaintenanceSchedule[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.maintenanceSchedule.list(params),
    queryFn: () => apiGet<MaintenanceSchedule[]>(`/maintenance-schedule${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Maintenance Schedule by ID.
 */
export function useMaintenanceSchedule(
  id: string | undefined,
  options?: Omit<UseQueryOptions<MaintenanceSchedule | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.maintenanceSchedule.detail(id ?? ''),
    queryFn: () => apiGet<MaintenanceSchedule | null>(`/maintenance-schedule/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Maintenance Schedule.
 * Automatically invalidates list queries on success.
 */
export function useCreateMaintenanceSchedule(
  options?: UseMutationOptions<MaintenanceSchedule, Error, Partial<MaintenanceSchedule>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<MaintenanceSchedule>) => apiPost<MaintenanceSchedule>('/maintenance-schedule', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceSchedule.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Maintenance Schedule.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateMaintenanceSchedule(
  options?: UseMutationOptions<MaintenanceSchedule, Error, { id: string; data: Partial<MaintenanceSchedule> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MaintenanceSchedule> }) =>
      apiPut<MaintenanceSchedule>(`/maintenance-schedule/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceSchedule.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceSchedule.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Maintenance Schedule by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteMaintenanceSchedule(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/maintenance-schedule/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceSchedule.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Maintenance Schedule (set docstatus = 1).
 */
export function useSubmitMaintenanceSchedule(
  options?: UseMutationOptions<MaintenanceSchedule, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<MaintenanceSchedule>(`/maintenance-schedule/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceSchedule.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceSchedule.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Maintenance Schedule (set docstatus = 2).
 */
export function useCancelMaintenanceSchedule(
  options?: UseMutationOptions<MaintenanceSchedule, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<MaintenanceSchedule>(`/maintenance-schedule/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceSchedule.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceSchedule.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
