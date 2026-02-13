// TanStack Query hooks for Master Production Schedule Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { MasterProductionScheduleItem } from '../types/master-production-schedule-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface MasterProductionScheduleItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Master Production Schedule Item records.
 */
export function useMasterProductionScheduleItemList(
  params: MasterProductionScheduleItemListParams = {},
  options?: Omit<UseQueryOptions<MasterProductionScheduleItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.masterProductionScheduleItem.list(params),
    queryFn: () => apiGet<MasterProductionScheduleItem[]>(`/master-production-schedule-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Master Production Schedule Item by ID.
 */
export function useMasterProductionScheduleItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<MasterProductionScheduleItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.masterProductionScheduleItem.detail(id ?? ''),
    queryFn: () => apiGet<MasterProductionScheduleItem | null>(`/master-production-schedule-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Master Production Schedule Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateMasterProductionScheduleItem(
  options?: UseMutationOptions<MasterProductionScheduleItem, Error, Partial<MasterProductionScheduleItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<MasterProductionScheduleItem>) => apiPost<MasterProductionScheduleItem>('/master-production-schedule-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.masterProductionScheduleItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Master Production Schedule Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateMasterProductionScheduleItem(
  options?: UseMutationOptions<MasterProductionScheduleItem, Error, { id: string; data: Partial<MasterProductionScheduleItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MasterProductionScheduleItem> }) =>
      apiPut<MasterProductionScheduleItem>(`/master-production-schedule-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.masterProductionScheduleItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.masterProductionScheduleItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Master Production Schedule Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteMasterProductionScheduleItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/master-production-schedule-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.masterProductionScheduleItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
