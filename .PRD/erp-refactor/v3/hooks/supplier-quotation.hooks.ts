// TanStack Query hooks for Supplier Quotation
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SupplierQuotation } from '../types/supplier-quotation.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SupplierQuotationListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Supplier Quotation records.
 */
export function useSupplierQuotationList(
  params: SupplierQuotationListParams = {},
  options?: Omit<UseQueryOptions<SupplierQuotation[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.supplierQuotation.list(params),
    queryFn: () => apiGet<SupplierQuotation[]>(`/supplier-quotation${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Supplier Quotation by ID.
 */
export function useSupplierQuotation(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SupplierQuotation | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.supplierQuotation.detail(id ?? ''),
    queryFn: () => apiGet<SupplierQuotation | null>(`/supplier-quotation/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Supplier Quotation.
 * Automatically invalidates list queries on success.
 */
export function useCreateSupplierQuotation(
  options?: UseMutationOptions<SupplierQuotation, Error, Partial<SupplierQuotation>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SupplierQuotation>) => apiPost<SupplierQuotation>('/supplier-quotation', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierQuotation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Supplier Quotation.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSupplierQuotation(
  options?: UseMutationOptions<SupplierQuotation, Error, { id: string; data: Partial<SupplierQuotation> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SupplierQuotation> }) =>
      apiPut<SupplierQuotation>(`/supplier-quotation/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierQuotation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierQuotation.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Supplier Quotation by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSupplierQuotation(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/supplier-quotation/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierQuotation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Supplier Quotation (set docstatus = 1).
 */
export function useSubmitSupplierQuotation(
  options?: UseMutationOptions<SupplierQuotation, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<SupplierQuotation>(`/supplier-quotation/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierQuotation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierQuotation.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Supplier Quotation (set docstatus = 2).
 */
export function useCancelSupplierQuotation(
  options?: UseMutationOptions<SupplierQuotation, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<SupplierQuotation>(`/supplier-quotation/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierQuotation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierQuotation.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
