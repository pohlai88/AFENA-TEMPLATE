// TanStack Query hooks for Item Tax
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ItemTax } from '../types/item-tax.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ItemTaxListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Item Tax records.
 */
export function useItemTaxList(
  params: ItemTaxListParams = {},
  options?: Omit<UseQueryOptions<ItemTax[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.itemTax.list(params),
    queryFn: () => apiGet<ItemTax[]>(`/item-tax${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Item Tax by ID.
 */
export function useItemTax(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ItemTax | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.itemTax.detail(id ?? ''),
    queryFn: () => apiGet<ItemTax | null>(`/item-tax/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Item Tax.
 * Automatically invalidates list queries on success.
 */
export function useCreateItemTax(
  options?: UseMutationOptions<ItemTax, Error, Partial<ItemTax>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ItemTax>) => apiPost<ItemTax>('/item-tax', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemTax.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Item Tax.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateItemTax(
  options?: UseMutationOptions<ItemTax, Error, { id: string; data: Partial<ItemTax> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItemTax> }) =>
      apiPut<ItemTax>(`/item-tax/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemTax.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.itemTax.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Item Tax by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteItemTax(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/item-tax/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemTax.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
