// TanStack Query hooks for Exchange Rate Revaluation
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ExchangeRateRevaluation } from '../types/exchange-rate-revaluation.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ExchangeRateRevaluationListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Exchange Rate Revaluation records.
 */
export function useExchangeRateRevaluationList(
  params: ExchangeRateRevaluationListParams = {},
  options?: Omit<UseQueryOptions<ExchangeRateRevaluation[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.exchangeRateRevaluation.list(params),
    queryFn: () => apiGet<ExchangeRateRevaluation[]>(`/exchange-rate-revaluation${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Exchange Rate Revaluation by ID.
 */
export function useExchangeRateRevaluation(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ExchangeRateRevaluation | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.exchangeRateRevaluation.detail(id ?? ''),
    queryFn: () => apiGet<ExchangeRateRevaluation | null>(`/exchange-rate-revaluation/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Exchange Rate Revaluation.
 * Automatically invalidates list queries on success.
 */
export function useCreateExchangeRateRevaluation(
  options?: UseMutationOptions<ExchangeRateRevaluation, Error, Partial<ExchangeRateRevaluation>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ExchangeRateRevaluation>) => apiPost<ExchangeRateRevaluation>('/exchange-rate-revaluation', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.exchangeRateRevaluation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Exchange Rate Revaluation.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateExchangeRateRevaluation(
  options?: UseMutationOptions<ExchangeRateRevaluation, Error, { id: string; data: Partial<ExchangeRateRevaluation> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ExchangeRateRevaluation> }) =>
      apiPut<ExchangeRateRevaluation>(`/exchange-rate-revaluation/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.exchangeRateRevaluation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.exchangeRateRevaluation.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Exchange Rate Revaluation by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteExchangeRateRevaluation(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/exchange-rate-revaluation/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.exchangeRateRevaluation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Exchange Rate Revaluation (set docstatus = 1).
 */
export function useSubmitExchangeRateRevaluation(
  options?: UseMutationOptions<ExchangeRateRevaluation, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<ExchangeRateRevaluation>(`/exchange-rate-revaluation/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.exchangeRateRevaluation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.exchangeRateRevaluation.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Exchange Rate Revaluation (set docstatus = 2).
 */
export function useCancelExchangeRateRevaluation(
  options?: UseMutationOptions<ExchangeRateRevaluation, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<ExchangeRateRevaluation>(`/exchange-rate-revaluation/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.exchangeRateRevaluation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.exchangeRateRevaluation.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
