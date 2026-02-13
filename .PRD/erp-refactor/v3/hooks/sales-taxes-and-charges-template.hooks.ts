// TanStack Query hooks for Sales Taxes and Charges Template
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SalesTaxesAndChargesTemplate } from '../types/sales-taxes-and-charges-template.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SalesTaxesAndChargesTemplateListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Sales Taxes and Charges Template records.
 */
export function useSalesTaxesAndChargesTemplateList(
  params: SalesTaxesAndChargesTemplateListParams = {},
  options?: Omit<UseQueryOptions<SalesTaxesAndChargesTemplate[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.salesTaxesAndChargesTemplate.list(params),
    queryFn: () => apiGet<SalesTaxesAndChargesTemplate[]>(`/sales-taxes-and-charges-template${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Sales Taxes and Charges Template by ID.
 */
export function useSalesTaxesAndChargesTemplate(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SalesTaxesAndChargesTemplate | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.salesTaxesAndChargesTemplate.detail(id ?? ''),
    queryFn: () => apiGet<SalesTaxesAndChargesTemplate | null>(`/sales-taxes-and-charges-template/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Sales Taxes and Charges Template.
 * Automatically invalidates list queries on success.
 */
export function useCreateSalesTaxesAndChargesTemplate(
  options?: UseMutationOptions<SalesTaxesAndChargesTemplate, Error, Partial<SalesTaxesAndChargesTemplate>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SalesTaxesAndChargesTemplate>) => apiPost<SalesTaxesAndChargesTemplate>('/sales-taxes-and-charges-template', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesTaxesAndChargesTemplate.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Sales Taxes and Charges Template.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSalesTaxesAndChargesTemplate(
  options?: UseMutationOptions<SalesTaxesAndChargesTemplate, Error, { id: string; data: Partial<SalesTaxesAndChargesTemplate> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SalesTaxesAndChargesTemplate> }) =>
      apiPut<SalesTaxesAndChargesTemplate>(`/sales-taxes-and-charges-template/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesTaxesAndChargesTemplate.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.salesTaxesAndChargesTemplate.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Sales Taxes and Charges Template by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSalesTaxesAndChargesTemplate(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/sales-taxes-and-charges-template/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesTaxesAndChargesTemplate.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
