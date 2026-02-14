// TanStack Query hooks for Landed Cost Vendor Invoice
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { LandedCostVendorInvoice } from '../types/landed-cost-vendor-invoice.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface LandedCostVendorInvoiceListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Landed Cost Vendor Invoice records.
 */
export function useLandedCostVendorInvoiceList(
  params: LandedCostVendorInvoiceListParams = {},
  options?: Omit<UseQueryOptions<LandedCostVendorInvoice[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.landedCostVendorInvoice.list(params),
    queryFn: () => apiGet<LandedCostVendorInvoice[]>(`/landed-cost-vendor-invoice${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Landed Cost Vendor Invoice by ID.
 */
export function useLandedCostVendorInvoice(
  id: string | undefined,
  options?: Omit<UseQueryOptions<LandedCostVendorInvoice | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.landedCostVendorInvoice.detail(id ?? ''),
    queryFn: () => apiGet<LandedCostVendorInvoice | null>(`/landed-cost-vendor-invoice/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Landed Cost Vendor Invoice.
 * Automatically invalidates list queries on success.
 */
export function useCreateLandedCostVendorInvoice(
  options?: UseMutationOptions<LandedCostVendorInvoice, Error, Partial<LandedCostVendorInvoice>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<LandedCostVendorInvoice>) => apiPost<LandedCostVendorInvoice>('/landed-cost-vendor-invoice', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.landedCostVendorInvoice.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Landed Cost Vendor Invoice.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateLandedCostVendorInvoice(
  options?: UseMutationOptions<LandedCostVendorInvoice, Error, { id: string; data: Partial<LandedCostVendorInvoice> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LandedCostVendorInvoice> }) =>
      apiPut<LandedCostVendorInvoice>(`/landed-cost-vendor-invoice/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.landedCostVendorInvoice.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.landedCostVendorInvoice.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Landed Cost Vendor Invoice by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteLandedCostVendorInvoice(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/landed-cost-vendor-invoice/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.landedCostVendorInvoice.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
