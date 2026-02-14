// TanStack Query hooks for Currency Exchange
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { CurrencyExchange } from '../types/currency-exchange.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface CurrencyExchangeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Currency Exchange records.
 */
export function useCurrencyExchangeList(
  params: CurrencyExchangeListParams = {},
  options?: Omit<UseQueryOptions<CurrencyExchange[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.currencyExchange.list(params),
    queryFn: () => apiGet<CurrencyExchange[]>(`/currency-exchange${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Currency Exchange by ID.
 */
export function useCurrencyExchange(
  id: string | undefined,
  options?: Omit<UseQueryOptions<CurrencyExchange | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.currencyExchange.detail(id ?? ''),
    queryFn: () => apiGet<CurrencyExchange | null>(`/currency-exchange/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Currency Exchange.
 * Automatically invalidates list queries on success.
 */
export function useCreateCurrencyExchange(
  options?: UseMutationOptions<CurrencyExchange, Error, Partial<CurrencyExchange>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CurrencyExchange>) => apiPost<CurrencyExchange>('/currency-exchange', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currencyExchange.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Currency Exchange.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateCurrencyExchange(
  options?: UseMutationOptions<CurrencyExchange, Error, { id: string; data: Partial<CurrencyExchange> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CurrencyExchange> }) =>
      apiPut<CurrencyExchange>(`/currency-exchange/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currencyExchange.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.currencyExchange.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Currency Exchange by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteCurrencyExchange(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/currency-exchange/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currencyExchange.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
