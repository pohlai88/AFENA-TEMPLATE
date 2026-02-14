// TanStack Query hooks for Pegged Currency Details
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PeggedCurrencyDetails } from '../types/pegged-currency-details.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PeggedCurrencyDetailsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Pegged Currency Details records.
 */
export function usePeggedCurrencyDetailsList(
  params: PeggedCurrencyDetailsListParams = {},
  options?: Omit<UseQueryOptions<PeggedCurrencyDetails[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.peggedCurrencyDetails.list(params),
    queryFn: () => apiGet<PeggedCurrencyDetails[]>(`/pegged-currency-details${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Pegged Currency Details by ID.
 */
export function usePeggedCurrencyDetails(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PeggedCurrencyDetails | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.peggedCurrencyDetails.detail(id ?? ''),
    queryFn: () => apiGet<PeggedCurrencyDetails | null>(`/pegged-currency-details/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Pegged Currency Details.
 * Automatically invalidates list queries on success.
 */
export function useCreatePeggedCurrencyDetails(
  options?: UseMutationOptions<PeggedCurrencyDetails, Error, Partial<PeggedCurrencyDetails>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PeggedCurrencyDetails>) => apiPost<PeggedCurrencyDetails>('/pegged-currency-details', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.peggedCurrencyDetails.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Pegged Currency Details.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePeggedCurrencyDetails(
  options?: UseMutationOptions<PeggedCurrencyDetails, Error, { id: string; data: Partial<PeggedCurrencyDetails> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PeggedCurrencyDetails> }) =>
      apiPut<PeggedCurrencyDetails>(`/pegged-currency-details/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.peggedCurrencyDetails.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.peggedCurrencyDetails.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Pegged Currency Details by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePeggedCurrencyDetails(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/pegged-currency-details/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.peggedCurrencyDetails.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
