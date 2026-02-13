// TanStack Query hooks for Currency Exchange Settings
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { CurrencyExchangeSettings } from '../types/currency-exchange-settings.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface CurrencyExchangeSettingsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Currency Exchange Settings records.
 */
export function useCurrencyExchangeSettingsList(
  params: CurrencyExchangeSettingsListParams = {},
  options?: Omit<UseQueryOptions<CurrencyExchangeSettings[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.currencyExchangeSettings.list(params),
    queryFn: () => apiGet<CurrencyExchangeSettings[]>(`/currency-exchange-settings${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Currency Exchange Settings by ID.
 */
export function useCurrencyExchangeSettings(
  id: string | undefined,
  options?: Omit<UseQueryOptions<CurrencyExchangeSettings | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.currencyExchangeSettings.detail(id ?? ''),
    queryFn: () => apiGet<CurrencyExchangeSettings | null>(`/currency-exchange-settings/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Currency Exchange Settings.
 * Automatically invalidates list queries on success.
 */
export function useCreateCurrencyExchangeSettings(
  options?: UseMutationOptions<CurrencyExchangeSettings, Error, Partial<CurrencyExchangeSettings>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CurrencyExchangeSettings>) => apiPost<CurrencyExchangeSettings>('/currency-exchange-settings', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currencyExchangeSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Currency Exchange Settings.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateCurrencyExchangeSettings(
  options?: UseMutationOptions<CurrencyExchangeSettings, Error, { id: string; data: Partial<CurrencyExchangeSettings> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CurrencyExchangeSettings> }) =>
      apiPut<CurrencyExchangeSettings>(`/currency-exchange-settings/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currencyExchangeSettings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.currencyExchangeSettings.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Currency Exchange Settings by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteCurrencyExchangeSettings(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/currency-exchange-settings/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currencyExchangeSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
