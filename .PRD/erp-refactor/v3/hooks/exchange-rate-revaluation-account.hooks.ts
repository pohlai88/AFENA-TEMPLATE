// TanStack Query hooks for Exchange Rate Revaluation Account
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ExchangeRateRevaluationAccount } from '../types/exchange-rate-revaluation-account.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ExchangeRateRevaluationAccountListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Exchange Rate Revaluation Account records.
 */
export function useExchangeRateRevaluationAccountList(
  params: ExchangeRateRevaluationAccountListParams = {},
  options?: Omit<UseQueryOptions<ExchangeRateRevaluationAccount[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.exchangeRateRevaluationAccount.list(params),
    queryFn: () => apiGet<ExchangeRateRevaluationAccount[]>(`/exchange-rate-revaluation-account${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Exchange Rate Revaluation Account by ID.
 */
export function useExchangeRateRevaluationAccount(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ExchangeRateRevaluationAccount | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.exchangeRateRevaluationAccount.detail(id ?? ''),
    queryFn: () => apiGet<ExchangeRateRevaluationAccount | null>(`/exchange-rate-revaluation-account/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Exchange Rate Revaluation Account.
 * Automatically invalidates list queries on success.
 */
export function useCreateExchangeRateRevaluationAccount(
  options?: UseMutationOptions<ExchangeRateRevaluationAccount, Error, Partial<ExchangeRateRevaluationAccount>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ExchangeRateRevaluationAccount>) => apiPost<ExchangeRateRevaluationAccount>('/exchange-rate-revaluation-account', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.exchangeRateRevaluationAccount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Exchange Rate Revaluation Account.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateExchangeRateRevaluationAccount(
  options?: UseMutationOptions<ExchangeRateRevaluationAccount, Error, { id: string; data: Partial<ExchangeRateRevaluationAccount> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ExchangeRateRevaluationAccount> }) =>
      apiPut<ExchangeRateRevaluationAccount>(`/exchange-rate-revaluation-account/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.exchangeRateRevaluationAccount.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.exchangeRateRevaluationAccount.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Exchange Rate Revaluation Account by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteExchangeRateRevaluationAccount(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/exchange-rate-revaluation-account/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.exchangeRateRevaluationAccount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
