// TanStack Query hooks for Sales Invoice Reference
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SalesInvoiceReference } from '../types/sales-invoice-reference.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SalesInvoiceReferenceListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Sales Invoice Reference records.
 */
export function useSalesInvoiceReferenceList(
  params: SalesInvoiceReferenceListParams = {},
  options?: Omit<UseQueryOptions<SalesInvoiceReference[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.salesInvoiceReference.list(params),
    queryFn: () => apiGet<SalesInvoiceReference[]>(`/sales-invoice-reference${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Sales Invoice Reference by ID.
 */
export function useSalesInvoiceReference(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SalesInvoiceReference | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.salesInvoiceReference.detail(id ?? ''),
    queryFn: () => apiGet<SalesInvoiceReference | null>(`/sales-invoice-reference/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Sales Invoice Reference.
 * Automatically invalidates list queries on success.
 */
export function useCreateSalesInvoiceReference(
  options?: UseMutationOptions<SalesInvoiceReference, Error, Partial<SalesInvoiceReference>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SalesInvoiceReference>) => apiPost<SalesInvoiceReference>('/sales-invoice-reference', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesInvoiceReference.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Sales Invoice Reference.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSalesInvoiceReference(
  options?: UseMutationOptions<SalesInvoiceReference, Error, { id: string; data: Partial<SalesInvoiceReference> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SalesInvoiceReference> }) =>
      apiPut<SalesInvoiceReference>(`/sales-invoice-reference/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesInvoiceReference.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.salesInvoiceReference.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Sales Invoice Reference by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSalesInvoiceReference(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/sales-invoice-reference/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesInvoiceReference.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
