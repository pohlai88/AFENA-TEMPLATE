// TanStack Query hooks for Import Supplier Invoice
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ImportSupplierInvoice } from '../types/import-supplier-invoice.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ImportSupplierInvoiceListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Import Supplier Invoice records.
 */
export function useImportSupplierInvoiceList(
  params: ImportSupplierInvoiceListParams = {},
  options?: Omit<UseQueryOptions<ImportSupplierInvoice[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.importSupplierInvoice.list(params),
    queryFn: () => apiGet<ImportSupplierInvoice[]>(`/import-supplier-invoice${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Import Supplier Invoice by ID.
 */
export function useImportSupplierInvoice(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ImportSupplierInvoice | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.importSupplierInvoice.detail(id ?? ''),
    queryFn: () => apiGet<ImportSupplierInvoice | null>(`/import-supplier-invoice/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Import Supplier Invoice.
 * Automatically invalidates list queries on success.
 */
export function useCreateImportSupplierInvoice(
  options?: UseMutationOptions<ImportSupplierInvoice, Error, Partial<ImportSupplierInvoice>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ImportSupplierInvoice>) => apiPost<ImportSupplierInvoice>('/import-supplier-invoice', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.importSupplierInvoice.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Import Supplier Invoice.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateImportSupplierInvoice(
  options?: UseMutationOptions<ImportSupplierInvoice, Error, { id: string; data: Partial<ImportSupplierInvoice> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ImportSupplierInvoice> }) =>
      apiPut<ImportSupplierInvoice>(`/import-supplier-invoice/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.importSupplierInvoice.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.importSupplierInvoice.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Import Supplier Invoice by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteImportSupplierInvoice(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/import-supplier-invoice/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.importSupplierInvoice.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
