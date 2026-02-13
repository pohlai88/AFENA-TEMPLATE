// TanStack Query hooks for Landed Cost Taxes and Charges
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { LandedCostTaxesAndCharges } from '../types/landed-cost-taxes-and-charges.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface LandedCostTaxesAndChargesListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Landed Cost Taxes and Charges records.
 */
export function useLandedCostTaxesAndChargesList(
  params: LandedCostTaxesAndChargesListParams = {},
  options?: Omit<UseQueryOptions<LandedCostTaxesAndCharges[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.landedCostTaxesAndCharges.list(params),
    queryFn: () => apiGet<LandedCostTaxesAndCharges[]>(`/landed-cost-taxes-and-charges${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Landed Cost Taxes and Charges by ID.
 */
export function useLandedCostTaxesAndCharges(
  id: string | undefined,
  options?: Omit<UseQueryOptions<LandedCostTaxesAndCharges | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.landedCostTaxesAndCharges.detail(id ?? ''),
    queryFn: () => apiGet<LandedCostTaxesAndCharges | null>(`/landed-cost-taxes-and-charges/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Landed Cost Taxes and Charges.
 * Automatically invalidates list queries on success.
 */
export function useCreateLandedCostTaxesAndCharges(
  options?: UseMutationOptions<LandedCostTaxesAndCharges, Error, Partial<LandedCostTaxesAndCharges>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<LandedCostTaxesAndCharges>) => apiPost<LandedCostTaxesAndCharges>('/landed-cost-taxes-and-charges', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.landedCostTaxesAndCharges.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Landed Cost Taxes and Charges.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateLandedCostTaxesAndCharges(
  options?: UseMutationOptions<LandedCostTaxesAndCharges, Error, { id: string; data: Partial<LandedCostTaxesAndCharges> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LandedCostTaxesAndCharges> }) =>
      apiPut<LandedCostTaxesAndCharges>(`/landed-cost-taxes-and-charges/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.landedCostTaxesAndCharges.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.landedCostTaxesAndCharges.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Landed Cost Taxes and Charges by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteLandedCostTaxesAndCharges(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/landed-cost-taxes-and-charges/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.landedCostTaxesAndCharges.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
