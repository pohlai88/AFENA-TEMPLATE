// TanStack Query hooks for Asset Repair Purchase Invoice
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AssetRepairPurchaseInvoice } from '../types/asset-repair-purchase-invoice.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AssetRepairPurchaseInvoiceListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Asset Repair Purchase Invoice records.
 */
export function useAssetRepairPurchaseInvoiceList(
  params: AssetRepairPurchaseInvoiceListParams = {},
  options?: Omit<UseQueryOptions<AssetRepairPurchaseInvoice[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.assetRepairPurchaseInvoice.list(params),
    queryFn: () => apiGet<AssetRepairPurchaseInvoice[]>(`/asset-repair-purchase-invoice${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Asset Repair Purchase Invoice by ID.
 */
export function useAssetRepairPurchaseInvoice(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AssetRepairPurchaseInvoice | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.assetRepairPurchaseInvoice.detail(id ?? ''),
    queryFn: () => apiGet<AssetRepairPurchaseInvoice | null>(`/asset-repair-purchase-invoice/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Asset Repair Purchase Invoice.
 * Automatically invalidates list queries on success.
 */
export function useCreateAssetRepairPurchaseInvoice(
  options?: UseMutationOptions<AssetRepairPurchaseInvoice, Error, Partial<AssetRepairPurchaseInvoice>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AssetRepairPurchaseInvoice>) => apiPost<AssetRepairPurchaseInvoice>('/asset-repair-purchase-invoice', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetRepairPurchaseInvoice.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Asset Repair Purchase Invoice.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAssetRepairPurchaseInvoice(
  options?: UseMutationOptions<AssetRepairPurchaseInvoice, Error, { id: string; data: Partial<AssetRepairPurchaseInvoice> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AssetRepairPurchaseInvoice> }) =>
      apiPut<AssetRepairPurchaseInvoice>(`/asset-repair-purchase-invoice/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetRepairPurchaseInvoice.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetRepairPurchaseInvoice.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Asset Repair Purchase Invoice by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAssetRepairPurchaseInvoice(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/asset-repair-purchase-invoice/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetRepairPurchaseInvoice.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
