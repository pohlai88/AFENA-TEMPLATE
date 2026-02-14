// TanStack Query hooks for Price List Country
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PriceListCountry } from '../types/price-list-country.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PriceListCountryListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Price List Country records.
 */
export function usePriceListCountryList(
  params: PriceListCountryListParams = {},
  options?: Omit<UseQueryOptions<PriceListCountry[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.priceListCountry.list(params),
    queryFn: () => apiGet<PriceListCountry[]>(`/price-list-country${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Price List Country by ID.
 */
export function usePriceListCountry(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PriceListCountry | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.priceListCountry.detail(id ?? ''),
    queryFn: () => apiGet<PriceListCountry | null>(`/price-list-country/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Price List Country.
 * Automatically invalidates list queries on success.
 */
export function useCreatePriceListCountry(
  options?: UseMutationOptions<PriceListCountry, Error, Partial<PriceListCountry>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PriceListCountry>) => apiPost<PriceListCountry>('/price-list-country', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.priceListCountry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Price List Country.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePriceListCountry(
  options?: UseMutationOptions<PriceListCountry, Error, { id: string; data: Partial<PriceListCountry> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PriceListCountry> }) =>
      apiPut<PriceListCountry>(`/price-list-country/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.priceListCountry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.priceListCountry.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Price List Country by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePriceListCountry(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/price-list-country/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.priceListCountry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
