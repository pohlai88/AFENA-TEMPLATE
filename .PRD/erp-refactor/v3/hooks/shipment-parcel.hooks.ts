// TanStack Query hooks for Shipment Parcel
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ShipmentParcel } from '../types/shipment-parcel.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ShipmentParcelListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Shipment Parcel records.
 */
export function useShipmentParcelList(
  params: ShipmentParcelListParams = {},
  options?: Omit<UseQueryOptions<ShipmentParcel[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.shipmentParcel.list(params),
    queryFn: () => apiGet<ShipmentParcel[]>(`/shipment-parcel${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Shipment Parcel by ID.
 */
export function useShipmentParcel(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ShipmentParcel | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.shipmentParcel.detail(id ?? ''),
    queryFn: () => apiGet<ShipmentParcel | null>(`/shipment-parcel/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Shipment Parcel.
 * Automatically invalidates list queries on success.
 */
export function useCreateShipmentParcel(
  options?: UseMutationOptions<ShipmentParcel, Error, Partial<ShipmentParcel>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ShipmentParcel>) => apiPost<ShipmentParcel>('/shipment-parcel', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shipmentParcel.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Shipment Parcel.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateShipmentParcel(
  options?: UseMutationOptions<ShipmentParcel, Error, { id: string; data: Partial<ShipmentParcel> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ShipmentParcel> }) =>
      apiPut<ShipmentParcel>(`/shipment-parcel/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shipmentParcel.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.shipmentParcel.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Shipment Parcel by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteShipmentParcel(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/shipment-parcel/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shipmentParcel.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
