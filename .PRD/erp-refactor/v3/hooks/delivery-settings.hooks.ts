// TanStack Query hooks for Delivery Settings
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { DeliverySettings } from '../types/delivery-settings.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface DeliverySettingsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Delivery Settings records.
 */
export function useDeliverySettingsList(
  params: DeliverySettingsListParams = {},
  options?: Omit<UseQueryOptions<DeliverySettings[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.deliverySettings.list(params),
    queryFn: () => apiGet<DeliverySettings[]>(`/delivery-settings${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Delivery Settings by ID.
 */
export function useDeliverySettings(
  id: string | undefined,
  options?: Omit<UseQueryOptions<DeliverySettings | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.deliverySettings.detail(id ?? ''),
    queryFn: () => apiGet<DeliverySettings | null>(`/delivery-settings/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Delivery Settings.
 * Automatically invalidates list queries on success.
 */
export function useCreateDeliverySettings(
  options?: UseMutationOptions<DeliverySettings, Error, Partial<DeliverySettings>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<DeliverySettings>) => apiPost<DeliverySettings>('/delivery-settings', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deliverySettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Delivery Settings.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateDeliverySettings(
  options?: UseMutationOptions<DeliverySettings, Error, { id: string; data: Partial<DeliverySettings> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DeliverySettings> }) =>
      apiPut<DeliverySettings>(`/delivery-settings/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deliverySettings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.deliverySettings.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Delivery Settings by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteDeliverySettings(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/delivery-settings/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deliverySettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
