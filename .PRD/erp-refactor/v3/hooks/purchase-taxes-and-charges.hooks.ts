// TanStack Query hooks for Purchase Taxes and Charges
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PurchaseTaxesAndCharges } from '../types/purchase-taxes-and-charges.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PurchaseTaxesAndChargesListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Purchase Taxes and Charges records.
 */
export function usePurchaseTaxesAndChargesList(
  params: PurchaseTaxesAndChargesListParams = {},
  options?: Omit<UseQueryOptions<PurchaseTaxesAndCharges[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.purchaseTaxesAndCharges.list(params),
    queryFn: () => apiGet<PurchaseTaxesAndCharges[]>(`/purchase-taxes-and-charges${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Purchase Taxes and Charges by ID.
 */
export function usePurchaseTaxesAndCharges(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PurchaseTaxesAndCharges | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.purchaseTaxesAndCharges.detail(id ?? ''),
    queryFn: () => apiGet<PurchaseTaxesAndCharges | null>(`/purchase-taxes-and-charges/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Purchase Taxes and Charges.
 * Automatically invalidates list queries on success.
 */
export function useCreatePurchaseTaxesAndCharges(
  options?: UseMutationOptions<PurchaseTaxesAndCharges, Error, Partial<PurchaseTaxesAndCharges>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PurchaseTaxesAndCharges>) => apiPost<PurchaseTaxesAndCharges>('/purchase-taxes-and-charges', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseTaxesAndCharges.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Purchase Taxes and Charges.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePurchaseTaxesAndCharges(
  options?: UseMutationOptions<PurchaseTaxesAndCharges, Error, { id: string; data: Partial<PurchaseTaxesAndCharges> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PurchaseTaxesAndCharges> }) =>
      apiPut<PurchaseTaxesAndCharges>(`/purchase-taxes-and-charges/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseTaxesAndCharges.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseTaxesAndCharges.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Purchase Taxes and Charges by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePurchaseTaxesAndCharges(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/purchase-taxes-and-charges/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseTaxesAndCharges.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
