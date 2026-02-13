// TanStack Query hooks for Item Wise Tax Detail
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ItemWiseTaxDetail } from '../types/item-wise-tax-detail.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ItemWiseTaxDetailListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Item Wise Tax Detail records.
 */
export function useItemWiseTaxDetailList(
  params: ItemWiseTaxDetailListParams = {},
  options?: Omit<UseQueryOptions<ItemWiseTaxDetail[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.itemWiseTaxDetail.list(params),
    queryFn: () => apiGet<ItemWiseTaxDetail[]>(`/item-wise-tax-detail${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Item Wise Tax Detail by ID.
 */
export function useItemWiseTaxDetail(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ItemWiseTaxDetail | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.itemWiseTaxDetail.detail(id ?? ''),
    queryFn: () => apiGet<ItemWiseTaxDetail | null>(`/item-wise-tax-detail/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Item Wise Tax Detail.
 * Automatically invalidates list queries on success.
 */
export function useCreateItemWiseTaxDetail(
  options?: UseMutationOptions<ItemWiseTaxDetail, Error, Partial<ItemWiseTaxDetail>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ItemWiseTaxDetail>) => apiPost<ItemWiseTaxDetail>('/item-wise-tax-detail', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemWiseTaxDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Item Wise Tax Detail.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateItemWiseTaxDetail(
  options?: UseMutationOptions<ItemWiseTaxDetail, Error, { id: string; data: Partial<ItemWiseTaxDetail> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItemWiseTaxDetail> }) =>
      apiPut<ItemWiseTaxDetail>(`/item-wise-tax-detail/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemWiseTaxDetail.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.itemWiseTaxDetail.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Item Wise Tax Detail by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteItemWiseTaxDetail(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/item-wise-tax-detail/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemWiseTaxDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
