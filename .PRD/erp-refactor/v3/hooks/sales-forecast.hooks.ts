// TanStack Query hooks for Sales Forecast
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SalesForecast } from '../types/sales-forecast.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SalesForecastListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Sales Forecast records.
 */
export function useSalesForecastList(
  params: SalesForecastListParams = {},
  options?: Omit<UseQueryOptions<SalesForecast[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.salesForecast.list(params),
    queryFn: () => apiGet<SalesForecast[]>(`/sales-forecast${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Sales Forecast by ID.
 */
export function useSalesForecast(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SalesForecast | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.salesForecast.detail(id ?? ''),
    queryFn: () => apiGet<SalesForecast | null>(`/sales-forecast/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Sales Forecast.
 * Automatically invalidates list queries on success.
 */
export function useCreateSalesForecast(
  options?: UseMutationOptions<SalesForecast, Error, Partial<SalesForecast>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SalesForecast>) => apiPost<SalesForecast>('/sales-forecast', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesForecast.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Sales Forecast.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSalesForecast(
  options?: UseMutationOptions<SalesForecast, Error, { id: string; data: Partial<SalesForecast> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SalesForecast> }) =>
      apiPut<SalesForecast>(`/sales-forecast/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesForecast.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.salesForecast.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Sales Forecast by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSalesForecast(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/sales-forecast/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesForecast.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Sales Forecast (set docstatus = 1).
 */
export function useSubmitSalesForecast(
  options?: UseMutationOptions<SalesForecast, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<SalesForecast>(`/sales-forecast/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesForecast.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.salesForecast.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Sales Forecast (set docstatus = 2).
 */
export function useCancelSalesForecast(
  options?: UseMutationOptions<SalesForecast, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<SalesForecast>(`/sales-forecast/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesForecast.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.salesForecast.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
