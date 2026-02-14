// TanStack Query hooks for Delivery Note Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { DeliveryNoteItem } from '../types/delivery-note-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface DeliveryNoteItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Delivery Note Item records.
 */
export function useDeliveryNoteItemList(
  params: DeliveryNoteItemListParams = {},
  options?: Omit<UseQueryOptions<DeliveryNoteItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.deliveryNoteItem.list(params),
    queryFn: () => apiGet<DeliveryNoteItem[]>(`/delivery-note-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Delivery Note Item by ID.
 */
export function useDeliveryNoteItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<DeliveryNoteItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.deliveryNoteItem.detail(id ?? ''),
    queryFn: () => apiGet<DeliveryNoteItem | null>(`/delivery-note-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Delivery Note Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateDeliveryNoteItem(
  options?: UseMutationOptions<DeliveryNoteItem, Error, Partial<DeliveryNoteItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<DeliveryNoteItem>) => apiPost<DeliveryNoteItem>('/delivery-note-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryNoteItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Delivery Note Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateDeliveryNoteItem(
  options?: UseMutationOptions<DeliveryNoteItem, Error, { id: string; data: Partial<DeliveryNoteItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DeliveryNoteItem> }) =>
      apiPut<DeliveryNoteItem>(`/delivery-note-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryNoteItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryNoteItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Delivery Note Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteDeliveryNoteItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/delivery-note-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryNoteItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
