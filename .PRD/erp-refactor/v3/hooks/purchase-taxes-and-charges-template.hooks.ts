// TanStack Query hooks for Purchase Taxes and Charges Template
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PurchaseTaxesAndChargesTemplate } from '../types/purchase-taxes-and-charges-template.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PurchaseTaxesAndChargesTemplateListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Purchase Taxes and Charges Template records.
 */
export function usePurchaseTaxesAndChargesTemplateList(
  params: PurchaseTaxesAndChargesTemplateListParams = {},
  options?: Omit<UseQueryOptions<PurchaseTaxesAndChargesTemplate[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.purchaseTaxesAndChargesTemplate.list(params),
    queryFn: () => apiGet<PurchaseTaxesAndChargesTemplate[]>(`/purchase-taxes-and-charges-template${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Purchase Taxes and Charges Template by ID.
 */
export function usePurchaseTaxesAndChargesTemplate(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PurchaseTaxesAndChargesTemplate | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.purchaseTaxesAndChargesTemplate.detail(id ?? ''),
    queryFn: () => apiGet<PurchaseTaxesAndChargesTemplate | null>(`/purchase-taxes-and-charges-template/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Purchase Taxes and Charges Template.
 * Automatically invalidates list queries on success.
 */
export function useCreatePurchaseTaxesAndChargesTemplate(
  options?: UseMutationOptions<PurchaseTaxesAndChargesTemplate, Error, Partial<PurchaseTaxesAndChargesTemplate>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PurchaseTaxesAndChargesTemplate>) => apiPost<PurchaseTaxesAndChargesTemplate>('/purchase-taxes-and-charges-template', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseTaxesAndChargesTemplate.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Purchase Taxes and Charges Template.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePurchaseTaxesAndChargesTemplate(
  options?: UseMutationOptions<PurchaseTaxesAndChargesTemplate, Error, { id: string; data: Partial<PurchaseTaxesAndChargesTemplate> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PurchaseTaxesAndChargesTemplate> }) =>
      apiPut<PurchaseTaxesAndChargesTemplate>(`/purchase-taxes-and-charges-template/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseTaxesAndChargesTemplate.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseTaxesAndChargesTemplate.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Purchase Taxes and Charges Template by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePurchaseTaxesAndChargesTemplate(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/purchase-taxes-and-charges-template/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseTaxesAndChargesTemplate.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
