// TanStack Query hooks for Shipment Parcel Template
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ShipmentParcelTemplate } from '../types/shipment-parcel-template.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ShipmentParcelTemplateListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Shipment Parcel Template records.
 */
export function useShipmentParcelTemplateList(
  params: ShipmentParcelTemplateListParams = {},
  options?: Omit<UseQueryOptions<ShipmentParcelTemplate[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.shipmentParcelTemplate.list(params),
    queryFn: () => apiGet<ShipmentParcelTemplate[]>(`/shipment-parcel-template${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Shipment Parcel Template by ID.
 */
export function useShipmentParcelTemplate(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ShipmentParcelTemplate | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.shipmentParcelTemplate.detail(id ?? ''),
    queryFn: () => apiGet<ShipmentParcelTemplate | null>(`/shipment-parcel-template/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Shipment Parcel Template.
 * Automatically invalidates list queries on success.
 */
export function useCreateShipmentParcelTemplate(
  options?: UseMutationOptions<ShipmentParcelTemplate, Error, Partial<ShipmentParcelTemplate>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ShipmentParcelTemplate>) => apiPost<ShipmentParcelTemplate>('/shipment-parcel-template', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shipmentParcelTemplate.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Shipment Parcel Template.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateShipmentParcelTemplate(
  options?: UseMutationOptions<ShipmentParcelTemplate, Error, { id: string; data: Partial<ShipmentParcelTemplate> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ShipmentParcelTemplate> }) =>
      apiPut<ShipmentParcelTemplate>(`/shipment-parcel-template/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shipmentParcelTemplate.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.shipmentParcelTemplate.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Shipment Parcel Template by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteShipmentParcelTemplate(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/shipment-parcel-template/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shipmentParcelTemplate.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
