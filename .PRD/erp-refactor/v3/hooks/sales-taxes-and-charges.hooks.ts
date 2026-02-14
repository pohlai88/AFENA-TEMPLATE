// TanStack Query hooks for Sales Taxes and Charges
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SalesTaxesAndCharges } from '../types/sales-taxes-and-charges.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SalesTaxesAndChargesListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Sales Taxes and Charges records.
 */
export function useSalesTaxesAndChargesList(
  params: SalesTaxesAndChargesListParams = {},
  options?: Omit<UseQueryOptions<SalesTaxesAndCharges[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.salesTaxesAndCharges.list(params),
    queryFn: () => apiGet<SalesTaxesAndCharges[]>(`/sales-taxes-and-charges${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Sales Taxes and Charges by ID.
 */
export function useSalesTaxesAndCharges(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SalesTaxesAndCharges | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.salesTaxesAndCharges.detail(id ?? ''),
    queryFn: () => apiGet<SalesTaxesAndCharges | null>(`/sales-taxes-and-charges/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Sales Taxes and Charges.
 * Automatically invalidates list queries on success.
 */
export function useCreateSalesTaxesAndCharges(
  options?: UseMutationOptions<SalesTaxesAndCharges, Error, Partial<SalesTaxesAndCharges>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SalesTaxesAndCharges>) => apiPost<SalesTaxesAndCharges>('/sales-taxes-and-charges', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesTaxesAndCharges.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Sales Taxes and Charges.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSalesTaxesAndCharges(
  options?: UseMutationOptions<SalesTaxesAndCharges, Error, { id: string; data: Partial<SalesTaxesAndCharges> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SalesTaxesAndCharges> }) =>
      apiPut<SalesTaxesAndCharges>(`/sales-taxes-and-charges/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesTaxesAndCharges.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.salesTaxesAndCharges.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Sales Taxes and Charges by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSalesTaxesAndCharges(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/sales-taxes-and-charges/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesTaxesAndCharges.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
