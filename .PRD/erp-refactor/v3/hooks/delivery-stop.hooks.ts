// TanStack Query hooks for Delivery Stop
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { DeliveryStop } from '../types/delivery-stop.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface DeliveryStopListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Delivery Stop records.
 */
export function useDeliveryStopList(
  params: DeliveryStopListParams = {},
  options?: Omit<UseQueryOptions<DeliveryStop[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.deliveryStop.list(params),
    queryFn: () => apiGet<DeliveryStop[]>(`/delivery-stop${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Delivery Stop by ID.
 */
export function useDeliveryStop(
  id: string | undefined,
  options?: Omit<UseQueryOptions<DeliveryStop | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.deliveryStop.detail(id ?? ''),
    queryFn: () => apiGet<DeliveryStop | null>(`/delivery-stop/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Delivery Stop.
 * Automatically invalidates list queries on success.
 */
export function useCreateDeliveryStop(
  options?: UseMutationOptions<DeliveryStop, Error, Partial<DeliveryStop>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<DeliveryStop>) => apiPost<DeliveryStop>('/delivery-stop', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryStop.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Delivery Stop.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateDeliveryStop(
  options?: UseMutationOptions<DeliveryStop, Error, { id: string; data: Partial<DeliveryStop> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DeliveryStop> }) =>
      apiPut<DeliveryStop>(`/delivery-stop/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryStop.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryStop.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Delivery Stop by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteDeliveryStop(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/delivery-stop/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryStop.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
