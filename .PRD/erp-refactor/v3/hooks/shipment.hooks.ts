// TanStack Query hooks for Shipment
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Shipment } from '../types/shipment.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ShipmentListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Shipment records.
 */
export function useShipmentList(
  params: ShipmentListParams = {},
  options?: Omit<UseQueryOptions<Shipment[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.shipment.list(params),
    queryFn: () => apiGet<Shipment[]>(`/shipment${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Shipment by ID.
 */
export function useShipment(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Shipment | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.shipment.detail(id ?? ''),
    queryFn: () => apiGet<Shipment | null>(`/shipment/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Shipment.
 * Automatically invalidates list queries on success.
 */
export function useCreateShipment(
  options?: UseMutationOptions<Shipment, Error, Partial<Shipment>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Shipment>) => apiPost<Shipment>('/shipment', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shipment.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Shipment.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateShipment(
  options?: UseMutationOptions<Shipment, Error, { id: string; data: Partial<Shipment> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Shipment> }) =>
      apiPut<Shipment>(`/shipment/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shipment.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.shipment.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Shipment by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteShipment(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/shipment/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shipment.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Shipment (set docstatus = 1).
 */
export function useSubmitShipment(
  options?: UseMutationOptions<Shipment, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<Shipment>(`/shipment/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shipment.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.shipment.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Shipment (set docstatus = 2).
 */
export function useCancelShipment(
  options?: UseMutationOptions<Shipment, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<Shipment>(`/shipment/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shipment.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.shipment.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
