// TanStack Query hooks for Shipping Rule Country
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ShippingRuleCountry } from '../types/shipping-rule-country.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ShippingRuleCountryListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Shipping Rule Country records.
 */
export function useShippingRuleCountryList(
  params: ShippingRuleCountryListParams = {},
  options?: Omit<UseQueryOptions<ShippingRuleCountry[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.shippingRuleCountry.list(params),
    queryFn: () => apiGet<ShippingRuleCountry[]>(`/shipping-rule-country${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Shipping Rule Country by ID.
 */
export function useShippingRuleCountry(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ShippingRuleCountry | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.shippingRuleCountry.detail(id ?? ''),
    queryFn: () => apiGet<ShippingRuleCountry | null>(`/shipping-rule-country/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Shipping Rule Country.
 * Automatically invalidates list queries on success.
 */
export function useCreateShippingRuleCountry(
  options?: UseMutationOptions<ShippingRuleCountry, Error, Partial<ShippingRuleCountry>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ShippingRuleCountry>) => apiPost<ShippingRuleCountry>('/shipping-rule-country', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shippingRuleCountry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Shipping Rule Country.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateShippingRuleCountry(
  options?: UseMutationOptions<ShippingRuleCountry, Error, { id: string; data: Partial<ShippingRuleCountry> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ShippingRuleCountry> }) =>
      apiPut<ShippingRuleCountry>(`/shipping-rule-country/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shippingRuleCountry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.shippingRuleCountry.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Shipping Rule Country by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteShippingRuleCountry(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/shipping-rule-country/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shippingRuleCountry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
