// TanStack Query hooks for Invoice Discounting
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { InvoiceDiscounting } from '../types/invoice-discounting.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface InvoiceDiscountingListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Invoice Discounting records.
 */
export function useInvoiceDiscountingList(
  params: InvoiceDiscountingListParams = {},
  options?: Omit<UseQueryOptions<InvoiceDiscounting[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.invoiceDiscounting.list(params),
    queryFn: () => apiGet<InvoiceDiscounting[]>(`/invoice-discounting${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Invoice Discounting by ID.
 */
export function useInvoiceDiscounting(
  id: string | undefined,
  options?: Omit<UseQueryOptions<InvoiceDiscounting | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.invoiceDiscounting.detail(id ?? ''),
    queryFn: () => apiGet<InvoiceDiscounting | null>(`/invoice-discounting/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Invoice Discounting.
 * Automatically invalidates list queries on success.
 */
export function useCreateInvoiceDiscounting(
  options?: UseMutationOptions<InvoiceDiscounting, Error, Partial<InvoiceDiscounting>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<InvoiceDiscounting>) => apiPost<InvoiceDiscounting>('/invoice-discounting', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoiceDiscounting.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Invoice Discounting.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateInvoiceDiscounting(
  options?: UseMutationOptions<InvoiceDiscounting, Error, { id: string; data: Partial<InvoiceDiscounting> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InvoiceDiscounting> }) =>
      apiPut<InvoiceDiscounting>(`/invoice-discounting/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoiceDiscounting.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.invoiceDiscounting.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Invoice Discounting by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteInvoiceDiscounting(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/invoice-discounting/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoiceDiscounting.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Invoice Discounting (set docstatus = 1).
 */
export function useSubmitInvoiceDiscounting(
  options?: UseMutationOptions<InvoiceDiscounting, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<InvoiceDiscounting>(`/invoice-discounting/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoiceDiscounting.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.invoiceDiscounting.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Invoice Discounting (set docstatus = 2).
 */
export function useCancelInvoiceDiscounting(
  options?: UseMutationOptions<InvoiceDiscounting, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<InvoiceDiscounting>(`/invoice-discounting/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoiceDiscounting.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.invoiceDiscounting.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
