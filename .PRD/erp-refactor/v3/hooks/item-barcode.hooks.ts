// TanStack Query hooks for Item Barcode
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ItemBarcode } from '../types/item-barcode.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ItemBarcodeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Item Barcode records.
 */
export function useItemBarcodeList(
  params: ItemBarcodeListParams = {},
  options?: Omit<UseQueryOptions<ItemBarcode[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.itemBarcode.list(params),
    queryFn: () => apiGet<ItemBarcode[]>(`/item-barcode${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Item Barcode by ID.
 */
export function useItemBarcode(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ItemBarcode | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.itemBarcode.detail(id ?? ''),
    queryFn: () => apiGet<ItemBarcode | null>(`/item-barcode/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Item Barcode.
 * Automatically invalidates list queries on success.
 */
export function useCreateItemBarcode(
  options?: UseMutationOptions<ItemBarcode, Error, Partial<ItemBarcode>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ItemBarcode>) => apiPost<ItemBarcode>('/item-barcode', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemBarcode.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Item Barcode.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateItemBarcode(
  options?: UseMutationOptions<ItemBarcode, Error, { id: string; data: Partial<ItemBarcode> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItemBarcode> }) =>
      apiPut<ItemBarcode>(`/item-barcode/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemBarcode.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.itemBarcode.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Item Barcode by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteItemBarcode(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/item-barcode/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemBarcode.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
