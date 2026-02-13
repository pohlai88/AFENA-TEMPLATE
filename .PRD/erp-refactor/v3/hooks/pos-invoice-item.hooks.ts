// TanStack Query hooks for POS Invoice Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PosInvoiceItem } from '../types/pos-invoice-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PosInvoiceItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of POS Invoice Item records.
 */
export function usePosInvoiceItemList(
  params: PosInvoiceItemListParams = {},
  options?: Omit<UseQueryOptions<PosInvoiceItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.posInvoiceItem.list(params),
    queryFn: () => apiGet<PosInvoiceItem[]>(`/pos-invoice-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single POS Invoice Item by ID.
 */
export function usePosInvoiceItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PosInvoiceItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.posInvoiceItem.detail(id ?? ''),
    queryFn: () => apiGet<PosInvoiceItem | null>(`/pos-invoice-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new POS Invoice Item.
 * Automatically invalidates list queries on success.
 */
export function useCreatePosInvoiceItem(
  options?: UseMutationOptions<PosInvoiceItem, Error, Partial<PosInvoiceItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PosInvoiceItem>) => apiPost<PosInvoiceItem>('/pos-invoice-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posInvoiceItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing POS Invoice Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePosInvoiceItem(
  options?: UseMutationOptions<PosInvoiceItem, Error, { id: string; data: Partial<PosInvoiceItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PosInvoiceItem> }) =>
      apiPut<PosInvoiceItem>(`/pos-invoice-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posInvoiceItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posInvoiceItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a POS Invoice Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePosInvoiceItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/pos-invoice-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posInvoiceItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
