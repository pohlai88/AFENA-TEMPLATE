// TanStack Query hooks for Shipment Delivery Note
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ShipmentDeliveryNote } from '../types/shipment-delivery-note.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ShipmentDeliveryNoteListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Shipment Delivery Note records.
 */
export function useShipmentDeliveryNoteList(
  params: ShipmentDeliveryNoteListParams = {},
  options?: Omit<UseQueryOptions<ShipmentDeliveryNote[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.shipmentDeliveryNote.list(params),
    queryFn: () => apiGet<ShipmentDeliveryNote[]>(`/shipment-delivery-note${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Shipment Delivery Note by ID.
 */
export function useShipmentDeliveryNote(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ShipmentDeliveryNote | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.shipmentDeliveryNote.detail(id ?? ''),
    queryFn: () => apiGet<ShipmentDeliveryNote | null>(`/shipment-delivery-note/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Shipment Delivery Note.
 * Automatically invalidates list queries on success.
 */
export function useCreateShipmentDeliveryNote(
  options?: UseMutationOptions<ShipmentDeliveryNote, Error, Partial<ShipmentDeliveryNote>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ShipmentDeliveryNote>) => apiPost<ShipmentDeliveryNote>('/shipment-delivery-note', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shipmentDeliveryNote.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Shipment Delivery Note.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateShipmentDeliveryNote(
  options?: UseMutationOptions<ShipmentDeliveryNote, Error, { id: string; data: Partial<ShipmentDeliveryNote> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ShipmentDeliveryNote> }) =>
      apiPut<ShipmentDeliveryNote>(`/shipment-delivery-note/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shipmentDeliveryNote.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.shipmentDeliveryNote.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Shipment Delivery Note by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteShipmentDeliveryNote(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/shipment-delivery-note/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shipmentDeliveryNote.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
