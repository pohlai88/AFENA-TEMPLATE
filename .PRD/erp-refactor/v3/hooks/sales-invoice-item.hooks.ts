// TanStack Query hooks for Sales Invoice Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SalesInvoiceItem } from '../types/sales-invoice-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SalesInvoiceItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Sales Invoice Item records.
 */
export function useSalesInvoiceItemList(
  params: SalesInvoiceItemListParams = {},
  options?: Omit<UseQueryOptions<SalesInvoiceItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.salesInvoiceItem.list(params),
    queryFn: () => apiGet<SalesInvoiceItem[]>(`/sales-invoice-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Sales Invoice Item by ID.
 */
export function useSalesInvoiceItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SalesInvoiceItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.salesInvoiceItem.detail(id ?? ''),
    queryFn: () => apiGet<SalesInvoiceItem | null>(`/sales-invoice-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Sales Invoice Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateSalesInvoiceItem(
  options?: UseMutationOptions<SalesInvoiceItem, Error, Partial<SalesInvoiceItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SalesInvoiceItem>) => apiPost<SalesInvoiceItem>('/sales-invoice-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesInvoiceItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Sales Invoice Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSalesInvoiceItem(
  options?: UseMutationOptions<SalesInvoiceItem, Error, { id: string; data: Partial<SalesInvoiceItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SalesInvoiceItem> }) =>
      apiPut<SalesInvoiceItem>(`/sales-invoice-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesInvoiceItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.salesInvoiceItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Sales Invoice Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSalesInvoiceItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/sales-invoice-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesInvoiceItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
