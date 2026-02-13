// TanStack Query hooks for Delivery Trip
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { DeliveryTrip } from '../types/delivery-trip.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface DeliveryTripListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Delivery Trip records.
 */
export function useDeliveryTripList(
  params: DeliveryTripListParams = {},
  options?: Omit<UseQueryOptions<DeliveryTrip[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.deliveryTrip.list(params),
    queryFn: () => apiGet<DeliveryTrip[]>(`/delivery-trip${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Delivery Trip by ID.
 */
export function useDeliveryTrip(
  id: string | undefined,
  options?: Omit<UseQueryOptions<DeliveryTrip | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.deliveryTrip.detail(id ?? ''),
    queryFn: () => apiGet<DeliveryTrip | null>(`/delivery-trip/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Delivery Trip.
 * Automatically invalidates list queries on success.
 */
export function useCreateDeliveryTrip(
  options?: UseMutationOptions<DeliveryTrip, Error, Partial<DeliveryTrip>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<DeliveryTrip>) => apiPost<DeliveryTrip>('/delivery-trip', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryTrip.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Delivery Trip.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateDeliveryTrip(
  options?: UseMutationOptions<DeliveryTrip, Error, { id: string; data: Partial<DeliveryTrip> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DeliveryTrip> }) =>
      apiPut<DeliveryTrip>(`/delivery-trip/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryTrip.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryTrip.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Delivery Trip by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteDeliveryTrip(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/delivery-trip/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryTrip.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Delivery Trip (set docstatus = 1).
 */
export function useSubmitDeliveryTrip(
  options?: UseMutationOptions<DeliveryTrip, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<DeliveryTrip>(`/delivery-trip/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryTrip.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryTrip.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Delivery Trip (set docstatus = 2).
 */
export function useCancelDeliveryTrip(
  options?: UseMutationOptions<DeliveryTrip, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<DeliveryTrip>(`/delivery-trip/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryTrip.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryTrip.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
