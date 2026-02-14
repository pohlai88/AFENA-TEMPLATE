// TanStack Query hooks for Item Tax Template Detail
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ItemTaxTemplateDetail } from '../types/item-tax-template-detail.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ItemTaxTemplateDetailListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Item Tax Template Detail records.
 */
export function useItemTaxTemplateDetailList(
  params: ItemTaxTemplateDetailListParams = {},
  options?: Omit<UseQueryOptions<ItemTaxTemplateDetail[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.itemTaxTemplateDetail.list(params),
    queryFn: () => apiGet<ItemTaxTemplateDetail[]>(`/item-tax-template-detail${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Item Tax Template Detail by ID.
 */
export function useItemTaxTemplateDetail(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ItemTaxTemplateDetail | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.itemTaxTemplateDetail.detail(id ?? ''),
    queryFn: () => apiGet<ItemTaxTemplateDetail | null>(`/item-tax-template-detail/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Item Tax Template Detail.
 * Automatically invalidates list queries on success.
 */
export function useCreateItemTaxTemplateDetail(
  options?: UseMutationOptions<ItemTaxTemplateDetail, Error, Partial<ItemTaxTemplateDetail>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ItemTaxTemplateDetail>) => apiPost<ItemTaxTemplateDetail>('/item-tax-template-detail', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemTaxTemplateDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Item Tax Template Detail.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateItemTaxTemplateDetail(
  options?: UseMutationOptions<ItemTaxTemplateDetail, Error, { id: string; data: Partial<ItemTaxTemplateDetail> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItemTaxTemplateDetail> }) =>
      apiPut<ItemTaxTemplateDetail>(`/item-tax-template-detail/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemTaxTemplateDetail.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.itemTaxTemplateDetail.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Item Tax Template Detail by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteItemTaxTemplateDetail(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/item-tax-template-detail/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemTaxTemplateDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
