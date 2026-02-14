// TanStack Query hooks for Currency Exchange Settings Details
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { CurrencyExchangeSettingsDetails } from '../types/currency-exchange-settings-details.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface CurrencyExchangeSettingsDetailsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Currency Exchange Settings Details records.
 */
export function useCurrencyExchangeSettingsDetailsList(
  params: CurrencyExchangeSettingsDetailsListParams = {},
  options?: Omit<UseQueryOptions<CurrencyExchangeSettingsDetails[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.currencyExchangeSettingsDetails.list(params),
    queryFn: () => apiGet<CurrencyExchangeSettingsDetails[]>(`/currency-exchange-settings-details${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Currency Exchange Settings Details by ID.
 */
export function useCurrencyExchangeSettingsDetails(
  id: string | undefined,
  options?: Omit<UseQueryOptions<CurrencyExchangeSettingsDetails | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.currencyExchangeSettingsDetails.detail(id ?? ''),
    queryFn: () => apiGet<CurrencyExchangeSettingsDetails | null>(`/currency-exchange-settings-details/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Currency Exchange Settings Details.
 * Automatically invalidates list queries on success.
 */
export function useCreateCurrencyExchangeSettingsDetails(
  options?: UseMutationOptions<CurrencyExchangeSettingsDetails, Error, Partial<CurrencyExchangeSettingsDetails>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CurrencyExchangeSettingsDetails>) => apiPost<CurrencyExchangeSettingsDetails>('/currency-exchange-settings-details', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currencyExchangeSettingsDetails.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Currency Exchange Settings Details.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateCurrencyExchangeSettingsDetails(
  options?: UseMutationOptions<CurrencyExchangeSettingsDetails, Error, { id: string; data: Partial<CurrencyExchangeSettingsDetails> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CurrencyExchangeSettingsDetails> }) =>
      apiPut<CurrencyExchangeSettingsDetails>(`/currency-exchange-settings-details/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currencyExchangeSettingsDetails.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.currencyExchangeSettingsDetails.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Currency Exchange Settings Details by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteCurrencyExchangeSettingsDetails(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/currency-exchange-settings-details/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currencyExchangeSettingsDetails.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
