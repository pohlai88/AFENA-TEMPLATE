// TanStack Query hooks for Currency Exchange Settings Result
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { CurrencyExchangeSettingsResult } from '../types/currency-exchange-settings-result.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface CurrencyExchangeSettingsResultListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Currency Exchange Settings Result records.
 */
export function useCurrencyExchangeSettingsResultList(
  params: CurrencyExchangeSettingsResultListParams = {},
  options?: Omit<UseQueryOptions<CurrencyExchangeSettingsResult[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.currencyExchangeSettingsResult.list(params),
    queryFn: () => apiGet<CurrencyExchangeSettingsResult[]>(`/currency-exchange-settings-result${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Currency Exchange Settings Result by ID.
 */
export function useCurrencyExchangeSettingsResult(
  id: string | undefined,
  options?: Omit<UseQueryOptions<CurrencyExchangeSettingsResult | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.currencyExchangeSettingsResult.detail(id ?? ''),
    queryFn: () => apiGet<CurrencyExchangeSettingsResult | null>(`/currency-exchange-settings-result/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Currency Exchange Settings Result.
 * Automatically invalidates list queries on success.
 */
export function useCreateCurrencyExchangeSettingsResult(
  options?: UseMutationOptions<CurrencyExchangeSettingsResult, Error, Partial<CurrencyExchangeSettingsResult>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CurrencyExchangeSettingsResult>) => apiPost<CurrencyExchangeSettingsResult>('/currency-exchange-settings-result', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currencyExchangeSettingsResult.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Currency Exchange Settings Result.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateCurrencyExchangeSettingsResult(
  options?: UseMutationOptions<CurrencyExchangeSettingsResult, Error, { id: string; data: Partial<CurrencyExchangeSettingsResult> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CurrencyExchangeSettingsResult> }) =>
      apiPut<CurrencyExchangeSettingsResult>(`/currency-exchange-settings-result/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currencyExchangeSettingsResult.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.currencyExchangeSettingsResult.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Currency Exchange Settings Result by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteCurrencyExchangeSettingsResult(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/currency-exchange-settings-result/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currencyExchangeSettingsResult.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
