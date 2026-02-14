// TanStack Query hooks for Sales Invoice Payment
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SalesInvoicePayment } from '../types/sales-invoice-payment.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SalesInvoicePaymentListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Sales Invoice Payment records.
 */
export function useSalesInvoicePaymentList(
  params: SalesInvoicePaymentListParams = {},
  options?: Omit<UseQueryOptions<SalesInvoicePayment[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.salesInvoicePayment.list(params),
    queryFn: () => apiGet<SalesInvoicePayment[]>(`/sales-invoice-payment${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Sales Invoice Payment by ID.
 */
export function useSalesInvoicePayment(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SalesInvoicePayment | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.salesInvoicePayment.detail(id ?? ''),
    queryFn: () => apiGet<SalesInvoicePayment | null>(`/sales-invoice-payment/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Sales Invoice Payment.
 * Automatically invalidates list queries on success.
 */
export function useCreateSalesInvoicePayment(
  options?: UseMutationOptions<SalesInvoicePayment, Error, Partial<SalesInvoicePayment>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SalesInvoicePayment>) => apiPost<SalesInvoicePayment>('/sales-invoice-payment', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesInvoicePayment.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Sales Invoice Payment.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSalesInvoicePayment(
  options?: UseMutationOptions<SalesInvoicePayment, Error, { id: string; data: Partial<SalesInvoicePayment> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SalesInvoicePayment> }) =>
      apiPut<SalesInvoicePayment>(`/sales-invoice-payment/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesInvoicePayment.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.salesInvoicePayment.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Sales Invoice Payment by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSalesInvoicePayment(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/sales-invoice-payment/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesInvoicePayment.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
