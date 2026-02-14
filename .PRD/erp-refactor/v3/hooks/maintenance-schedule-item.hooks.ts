// TanStack Query hooks for Maintenance Schedule Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { MaintenanceScheduleItem } from '../types/maintenance-schedule-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface MaintenanceScheduleItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Maintenance Schedule Item records.
 */
export function useMaintenanceScheduleItemList(
  params: MaintenanceScheduleItemListParams = {},
  options?: Omit<UseQueryOptions<MaintenanceScheduleItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.maintenanceScheduleItem.list(params),
    queryFn: () => apiGet<MaintenanceScheduleItem[]>(`/maintenance-schedule-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Maintenance Schedule Item by ID.
 */
export function useMaintenanceScheduleItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<MaintenanceScheduleItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.maintenanceScheduleItem.detail(id ?? ''),
    queryFn: () => apiGet<MaintenanceScheduleItem | null>(`/maintenance-schedule-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Maintenance Schedule Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateMaintenanceScheduleItem(
  options?: UseMutationOptions<MaintenanceScheduleItem, Error, Partial<MaintenanceScheduleItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<MaintenanceScheduleItem>) => apiPost<MaintenanceScheduleItem>('/maintenance-schedule-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceScheduleItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Maintenance Schedule Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateMaintenanceScheduleItem(
  options?: UseMutationOptions<MaintenanceScheduleItem, Error, { id: string; data: Partial<MaintenanceScheduleItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MaintenanceScheduleItem> }) =>
      apiPut<MaintenanceScheduleItem>(`/maintenance-schedule-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceScheduleItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceScheduleItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Maintenance Schedule Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteMaintenanceScheduleItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/maintenance-schedule-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceScheduleItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
