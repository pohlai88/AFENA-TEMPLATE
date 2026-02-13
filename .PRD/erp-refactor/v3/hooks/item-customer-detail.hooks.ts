// TanStack Query hooks for Item Customer Detail
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ItemCustomerDetail } from '../types/item-customer-detail.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ItemCustomerDetailListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Item Customer Detail records.
 */
export function useItemCustomerDetailList(
  params: ItemCustomerDetailListParams = {},
  options?: Omit<UseQueryOptions<ItemCustomerDetail[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.itemCustomerDetail.list(params),
    queryFn: () => apiGet<ItemCustomerDetail[]>(`/item-customer-detail${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Item Customer Detail by ID.
 */
export function useItemCustomerDetail(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ItemCustomerDetail | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.itemCustomerDetail.detail(id ?? ''),
    queryFn: () => apiGet<ItemCustomerDetail | null>(`/item-customer-detail/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Item Customer Detail.
 * Automatically invalidates list queries on success.
 */
export function useCreateItemCustomerDetail(
  options?: UseMutationOptions<ItemCustomerDetail, Error, Partial<ItemCustomerDetail>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ItemCustomerDetail>) => apiPost<ItemCustomerDetail>('/item-customer-detail', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemCustomerDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Item Customer Detail.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateItemCustomerDetail(
  options?: UseMutationOptions<ItemCustomerDetail, Error, { id: string; data: Partial<ItemCustomerDetail> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItemCustomerDetail> }) =>
      apiPut<ItemCustomerDetail>(`/item-customer-detail/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemCustomerDetail.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.itemCustomerDetail.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Item Customer Detail by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteItemCustomerDetail(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/item-customer-detail/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemCustomerDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
