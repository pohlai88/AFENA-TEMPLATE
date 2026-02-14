// TanStack Query hooks for Supplier Quotation Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SupplierQuotationItem } from '../types/supplier-quotation-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SupplierQuotationItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Supplier Quotation Item records.
 */
export function useSupplierQuotationItemList(
  params: SupplierQuotationItemListParams = {},
  options?: Omit<UseQueryOptions<SupplierQuotationItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.supplierQuotationItem.list(params),
    queryFn: () => apiGet<SupplierQuotationItem[]>(`/supplier-quotation-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Supplier Quotation Item by ID.
 */
export function useSupplierQuotationItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SupplierQuotationItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.supplierQuotationItem.detail(id ?? ''),
    queryFn: () => apiGet<SupplierQuotationItem | null>(`/supplier-quotation-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Supplier Quotation Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateSupplierQuotationItem(
  options?: UseMutationOptions<SupplierQuotationItem, Error, Partial<SupplierQuotationItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SupplierQuotationItem>) => apiPost<SupplierQuotationItem>('/supplier-quotation-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierQuotationItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Supplier Quotation Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSupplierQuotationItem(
  options?: UseMutationOptions<SupplierQuotationItem, Error, { id: string; data: Partial<SupplierQuotationItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SupplierQuotationItem> }) =>
      apiPut<SupplierQuotationItem>(`/supplier-quotation-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierQuotationItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierQuotationItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Supplier Quotation Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSupplierQuotationItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/supplier-quotation-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierQuotationItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
