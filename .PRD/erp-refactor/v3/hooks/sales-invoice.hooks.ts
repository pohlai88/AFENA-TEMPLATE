// TanStack Query hooks for Sales Invoice
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SalesInvoice } from '../types/sales-invoice.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SalesInvoiceListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Sales Invoice records.
 */
export function useSalesInvoiceList(
  params: SalesInvoiceListParams = {},
  options?: Omit<UseQueryOptions<SalesInvoice[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.salesInvoice.list(params),
    queryFn: () => apiGet<SalesInvoice[]>(`/sales-invoice${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Sales Invoice by ID.
 */
export function useSalesInvoice(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SalesInvoice | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.salesInvoice.detail(id ?? ''),
    queryFn: () => apiGet<SalesInvoice | null>(`/sales-invoice/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Sales Invoice.
 * Automatically invalidates list queries on success.
 */
export function useCreateSalesInvoice(
  options?: UseMutationOptions<SalesInvoice, Error, Partial<SalesInvoice>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SalesInvoice>) => apiPost<SalesInvoice>('/sales-invoice', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesInvoice.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Sales Invoice.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSalesInvoice(
  options?: UseMutationOptions<SalesInvoice, Error, { id: string; data: Partial<SalesInvoice> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SalesInvoice> }) =>
      apiPut<SalesInvoice>(`/sales-invoice/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesInvoice.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.salesInvoice.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Sales Invoice by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSalesInvoice(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/sales-invoice/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesInvoice.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Sales Invoice (set docstatus = 1).
 */
export function useSubmitSalesInvoice(
  options?: UseMutationOptions<SalesInvoice, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<SalesInvoice>(`/sales-invoice/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesInvoice.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.salesInvoice.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Sales Invoice (set docstatus = 2).
 */
export function useCancelSalesInvoice(
  options?: UseMutationOptions<SalesInvoice, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<SalesInvoice>(`/sales-invoice/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesInvoice.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.salesInvoice.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
