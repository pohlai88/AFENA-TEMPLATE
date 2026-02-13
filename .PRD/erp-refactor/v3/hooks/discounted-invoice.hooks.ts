// TanStack Query hooks for Discounted Invoice
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { DiscountedInvoice } from '../types/discounted-invoice.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface DiscountedInvoiceListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Discounted Invoice records.
 */
export function useDiscountedInvoiceList(
  params: DiscountedInvoiceListParams = {},
  options?: Omit<UseQueryOptions<DiscountedInvoice[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.discountedInvoice.list(params),
    queryFn: () => apiGet<DiscountedInvoice[]>(`/discounted-invoice${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Discounted Invoice by ID.
 */
export function useDiscountedInvoice(
  id: string | undefined,
  options?: Omit<UseQueryOptions<DiscountedInvoice | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.discountedInvoice.detail(id ?? ''),
    queryFn: () => apiGet<DiscountedInvoice | null>(`/discounted-invoice/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Discounted Invoice.
 * Automatically invalidates list queries on success.
 */
export function useCreateDiscountedInvoice(
  options?: UseMutationOptions<DiscountedInvoice, Error, Partial<DiscountedInvoice>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<DiscountedInvoice>) => apiPost<DiscountedInvoice>('/discounted-invoice', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.discountedInvoice.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Discounted Invoice.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateDiscountedInvoice(
  options?: UseMutationOptions<DiscountedInvoice, Error, { id: string; data: Partial<DiscountedInvoice> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DiscountedInvoice> }) =>
      apiPut<DiscountedInvoice>(`/discounted-invoice/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.discountedInvoice.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.discountedInvoice.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Discounted Invoice by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteDiscountedInvoice(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/discounted-invoice/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.discountedInvoice.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
