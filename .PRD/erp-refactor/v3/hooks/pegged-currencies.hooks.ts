// TanStack Query hooks for Pegged Currencies
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PeggedCurrencies } from '../types/pegged-currencies.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PeggedCurrenciesListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Pegged Currencies records.
 */
export function usePeggedCurrenciesList(
  params: PeggedCurrenciesListParams = {},
  options?: Omit<UseQueryOptions<PeggedCurrencies[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.peggedCurrencies.list(params),
    queryFn: () => apiGet<PeggedCurrencies[]>(`/pegged-currencies${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Pegged Currencies by ID.
 */
export function usePeggedCurrencies(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PeggedCurrencies | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.peggedCurrencies.detail(id ?? ''),
    queryFn: () => apiGet<PeggedCurrencies | null>(`/pegged-currencies/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Pegged Currencies.
 * Automatically invalidates list queries on success.
 */
export function useCreatePeggedCurrencies(
  options?: UseMutationOptions<PeggedCurrencies, Error, Partial<PeggedCurrencies>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PeggedCurrencies>) => apiPost<PeggedCurrencies>('/pegged-currencies', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.peggedCurrencies.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Pegged Currencies.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePeggedCurrencies(
  options?: UseMutationOptions<PeggedCurrencies, Error, { id: string; data: Partial<PeggedCurrencies> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PeggedCurrencies> }) =>
      apiPut<PeggedCurrencies>(`/pegged-currencies/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.peggedCurrencies.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.peggedCurrencies.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Pegged Currencies by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePeggedCurrencies(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/pegged-currencies/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.peggedCurrencies.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
