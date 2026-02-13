// TanStack Query hooks for Landed Cost Purchase Receipt
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { LandedCostPurchaseReceipt } from '../types/landed-cost-purchase-receipt.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface LandedCostPurchaseReceiptListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Landed Cost Purchase Receipt records.
 */
export function useLandedCostPurchaseReceiptList(
  params: LandedCostPurchaseReceiptListParams = {},
  options?: Omit<UseQueryOptions<LandedCostPurchaseReceipt[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.landedCostPurchaseReceipt.list(params),
    queryFn: () => apiGet<LandedCostPurchaseReceipt[]>(`/landed-cost-purchase-receipt${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Landed Cost Purchase Receipt by ID.
 */
export function useLandedCostPurchaseReceipt(
  id: string | undefined,
  options?: Omit<UseQueryOptions<LandedCostPurchaseReceipt | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.landedCostPurchaseReceipt.detail(id ?? ''),
    queryFn: () => apiGet<LandedCostPurchaseReceipt | null>(`/landed-cost-purchase-receipt/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Landed Cost Purchase Receipt.
 * Automatically invalidates list queries on success.
 */
export function useCreateLandedCostPurchaseReceipt(
  options?: UseMutationOptions<LandedCostPurchaseReceipt, Error, Partial<LandedCostPurchaseReceipt>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<LandedCostPurchaseReceipt>) => apiPost<LandedCostPurchaseReceipt>('/landed-cost-purchase-receipt', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.landedCostPurchaseReceipt.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Landed Cost Purchase Receipt.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateLandedCostPurchaseReceipt(
  options?: UseMutationOptions<LandedCostPurchaseReceipt, Error, { id: string; data: Partial<LandedCostPurchaseReceipt> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LandedCostPurchaseReceipt> }) =>
      apiPut<LandedCostPurchaseReceipt>(`/landed-cost-purchase-receipt/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.landedCostPurchaseReceipt.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.landedCostPurchaseReceipt.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Landed Cost Purchase Receipt by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteLandedCostPurchaseReceipt(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/landed-cost-purchase-receipt/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.landedCostPurchaseReceipt.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
