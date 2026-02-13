// TanStack Query hooks for Sales Invoice Advance
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SalesInvoiceAdvance } from '../types/sales-invoice-advance.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SalesInvoiceAdvanceListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Sales Invoice Advance records.
 */
export function useSalesInvoiceAdvanceList(
  params: SalesInvoiceAdvanceListParams = {},
  options?: Omit<UseQueryOptions<SalesInvoiceAdvance[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.salesInvoiceAdvance.list(params),
    queryFn: () => apiGet<SalesInvoiceAdvance[]>(`/sales-invoice-advance${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Sales Invoice Advance by ID.
 */
export function useSalesInvoiceAdvance(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SalesInvoiceAdvance | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.salesInvoiceAdvance.detail(id ?? ''),
    queryFn: () => apiGet<SalesInvoiceAdvance | null>(`/sales-invoice-advance/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Sales Invoice Advance.
 * Automatically invalidates list queries on success.
 */
export function useCreateSalesInvoiceAdvance(
  options?: UseMutationOptions<SalesInvoiceAdvance, Error, Partial<SalesInvoiceAdvance>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SalesInvoiceAdvance>) => apiPost<SalesInvoiceAdvance>('/sales-invoice-advance', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesInvoiceAdvance.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Sales Invoice Advance.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSalesInvoiceAdvance(
  options?: UseMutationOptions<SalesInvoiceAdvance, Error, { id: string; data: Partial<SalesInvoiceAdvance> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SalesInvoiceAdvance> }) =>
      apiPut<SalesInvoiceAdvance>(`/sales-invoice-advance/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesInvoiceAdvance.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.salesInvoiceAdvance.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Sales Invoice Advance by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSalesInvoiceAdvance(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/sales-invoice-advance/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesInvoiceAdvance.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
