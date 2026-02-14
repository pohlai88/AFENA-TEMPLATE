// TanStack Query hooks for Delivery Schedule Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { DeliveryScheduleItem } from '../types/delivery-schedule-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface DeliveryScheduleItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Delivery Schedule Item records.
 */
export function useDeliveryScheduleItemList(
  params: DeliveryScheduleItemListParams = {},
  options?: Omit<UseQueryOptions<DeliveryScheduleItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.deliveryScheduleItem.list(params),
    queryFn: () => apiGet<DeliveryScheduleItem[]>(`/delivery-schedule-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Delivery Schedule Item by ID.
 */
export function useDeliveryScheduleItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<DeliveryScheduleItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.deliveryScheduleItem.detail(id ?? ''),
    queryFn: () => apiGet<DeliveryScheduleItem | null>(`/delivery-schedule-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Delivery Schedule Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateDeliveryScheduleItem(
  options?: UseMutationOptions<DeliveryScheduleItem, Error, Partial<DeliveryScheduleItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<DeliveryScheduleItem>) => apiPost<DeliveryScheduleItem>('/delivery-schedule-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryScheduleItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Delivery Schedule Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateDeliveryScheduleItem(
  options?: UseMutationOptions<DeliveryScheduleItem, Error, { id: string; data: Partial<DeliveryScheduleItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DeliveryScheduleItem> }) =>
      apiPut<DeliveryScheduleItem>(`/delivery-schedule-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryScheduleItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryScheduleItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Delivery Schedule Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteDeliveryScheduleItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/delivery-schedule-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryScheduleItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
