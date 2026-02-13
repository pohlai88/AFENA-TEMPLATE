// TanStack Query hooks for Maintenance Schedule Detail
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { MaintenanceScheduleDetail } from '../types/maintenance-schedule-detail.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface MaintenanceScheduleDetailListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Maintenance Schedule Detail records.
 */
export function useMaintenanceScheduleDetailList(
  params: MaintenanceScheduleDetailListParams = {},
  options?: Omit<UseQueryOptions<MaintenanceScheduleDetail[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.maintenanceScheduleDetail.list(params),
    queryFn: () => apiGet<MaintenanceScheduleDetail[]>(`/maintenance-schedule-detail${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Maintenance Schedule Detail by ID.
 */
export function useMaintenanceScheduleDetail(
  id: string | undefined,
  options?: Omit<UseQueryOptions<MaintenanceScheduleDetail | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.maintenanceScheduleDetail.detail(id ?? ''),
    queryFn: () => apiGet<MaintenanceScheduleDetail | null>(`/maintenance-schedule-detail/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Maintenance Schedule Detail.
 * Automatically invalidates list queries on success.
 */
export function useCreateMaintenanceScheduleDetail(
  options?: UseMutationOptions<MaintenanceScheduleDetail, Error, Partial<MaintenanceScheduleDetail>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<MaintenanceScheduleDetail>) => apiPost<MaintenanceScheduleDetail>('/maintenance-schedule-detail', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceScheduleDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Maintenance Schedule Detail.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateMaintenanceScheduleDetail(
  options?: UseMutationOptions<MaintenanceScheduleDetail, Error, { id: string; data: Partial<MaintenanceScheduleDetail> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MaintenanceScheduleDetail> }) =>
      apiPut<MaintenanceScheduleDetail>(`/maintenance-schedule-detail/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceScheduleDetail.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceScheduleDetail.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Maintenance Schedule Detail by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteMaintenanceScheduleDetail(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/maintenance-schedule-detail/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceScheduleDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
