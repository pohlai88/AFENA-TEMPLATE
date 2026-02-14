// TanStack Query hooks for Sales Forecast Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SalesForecastItem } from '../types/sales-forecast-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SalesForecastItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Sales Forecast Item records.
 */
export function useSalesForecastItemList(
  params: SalesForecastItemListParams = {},
  options?: Omit<UseQueryOptions<SalesForecastItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.salesForecastItem.list(params),
    queryFn: () => apiGet<SalesForecastItem[]>(`/sales-forecast-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Sales Forecast Item by ID.
 */
export function useSalesForecastItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SalesForecastItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.salesForecastItem.detail(id ?? ''),
    queryFn: () => apiGet<SalesForecastItem | null>(`/sales-forecast-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Sales Forecast Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateSalesForecastItem(
  options?: UseMutationOptions<SalesForecastItem, Error, Partial<SalesForecastItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SalesForecastItem>) => apiPost<SalesForecastItem>('/sales-forecast-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesForecastItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Sales Forecast Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSalesForecastItem(
  options?: UseMutationOptions<SalesForecastItem, Error, { id: string; data: Partial<SalesForecastItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SalesForecastItem> }) =>
      apiPut<SalesForecastItem>(`/sales-forecast-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesForecastItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.salesForecastItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Sales Forecast Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSalesForecastItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/sales-forecast-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesForecastItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
