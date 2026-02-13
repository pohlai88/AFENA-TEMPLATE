// TanStack Query hooks for Price List
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PriceList } from '../types/price-list.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PriceListListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Price List records.
 */
export function usePriceListList(
  params: PriceListListParams = {},
  options?: Omit<UseQueryOptions<PriceList[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.priceList.list(params),
    queryFn: () => apiGet<PriceList[]>(`/price-list${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Price List by ID.
 */
export function usePriceList(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PriceList | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.priceList.detail(id ?? ''),
    queryFn: () => apiGet<PriceList | null>(`/price-list/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Price List.
 * Automatically invalidates list queries on success.
 */
export function useCreatePriceList(
  options?: UseMutationOptions<PriceList, Error, Partial<PriceList>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PriceList>) => apiPost<PriceList>('/price-list', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.priceList.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Price List.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePriceList(
  options?: UseMutationOptions<PriceList, Error, { id: string; data: Partial<PriceList> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PriceList> }) =>
      apiPut<PriceList>(`/price-list/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.priceList.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.priceList.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Price List by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePriceList(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/price-list/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.priceList.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
