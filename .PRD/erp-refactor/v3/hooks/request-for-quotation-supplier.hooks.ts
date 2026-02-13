// TanStack Query hooks for Request for Quotation Supplier
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { RequestForQuotationSupplier } from '../types/request-for-quotation-supplier.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface RequestForQuotationSupplierListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Request for Quotation Supplier records.
 */
export function useRequestForQuotationSupplierList(
  params: RequestForQuotationSupplierListParams = {},
  options?: Omit<UseQueryOptions<RequestForQuotationSupplier[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.requestForQuotationSupplier.list(params),
    queryFn: () => apiGet<RequestForQuotationSupplier[]>(`/request-for-quotation-supplier${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Request for Quotation Supplier by ID.
 */
export function useRequestForQuotationSupplier(
  id: string | undefined,
  options?: Omit<UseQueryOptions<RequestForQuotationSupplier | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.requestForQuotationSupplier.detail(id ?? ''),
    queryFn: () => apiGet<RequestForQuotationSupplier | null>(`/request-for-quotation-supplier/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Request for Quotation Supplier.
 * Automatically invalidates list queries on success.
 */
export function useCreateRequestForQuotationSupplier(
  options?: UseMutationOptions<RequestForQuotationSupplier, Error, Partial<RequestForQuotationSupplier>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<RequestForQuotationSupplier>) => apiPost<RequestForQuotationSupplier>('/request-for-quotation-supplier', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requestForQuotationSupplier.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Request for Quotation Supplier.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateRequestForQuotationSupplier(
  options?: UseMutationOptions<RequestForQuotationSupplier, Error, { id: string; data: Partial<RequestForQuotationSupplier> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RequestForQuotationSupplier> }) =>
      apiPut<RequestForQuotationSupplier>(`/request-for-quotation-supplier/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requestForQuotationSupplier.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.requestForQuotationSupplier.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Request for Quotation Supplier by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteRequestForQuotationSupplier(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/request-for-quotation-supplier/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requestForQuotationSupplier.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
