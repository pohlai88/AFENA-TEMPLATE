// TanStack Query hooks for Tax Withholding Rate
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { TaxWithholdingRate } from '../types/tax-withholding-rate.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface TaxWithholdingRateListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Tax Withholding Rate records.
 */
export function useTaxWithholdingRateList(
  params: TaxWithholdingRateListParams = {},
  options?: Omit<UseQueryOptions<TaxWithholdingRate[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.taxWithholdingRate.list(params),
    queryFn: () => apiGet<TaxWithholdingRate[]>(`/tax-withholding-rate${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Tax Withholding Rate by ID.
 */
export function useTaxWithholdingRate(
  id: string | undefined,
  options?: Omit<UseQueryOptions<TaxWithholdingRate | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.taxWithholdingRate.detail(id ?? ''),
    queryFn: () => apiGet<TaxWithholdingRate | null>(`/tax-withholding-rate/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Tax Withholding Rate.
 * Automatically invalidates list queries on success.
 */
export function useCreateTaxWithholdingRate(
  options?: UseMutationOptions<TaxWithholdingRate, Error, Partial<TaxWithholdingRate>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<TaxWithholdingRate>) => apiPost<TaxWithholdingRate>('/tax-withholding-rate', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taxWithholdingRate.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Tax Withholding Rate.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateTaxWithholdingRate(
  options?: UseMutationOptions<TaxWithholdingRate, Error, { id: string; data: Partial<TaxWithholdingRate> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TaxWithholdingRate> }) =>
      apiPut<TaxWithholdingRate>(`/tax-withholding-rate/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taxWithholdingRate.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.taxWithholdingRate.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Tax Withholding Rate by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteTaxWithholdingRate(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/tax-withholding-rate/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taxWithholdingRate.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
