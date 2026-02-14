// TanStack Query hooks for Sales Partner Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SalesPartnerItem } from '../types/sales-partner-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SalesPartnerItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Sales Partner Item records.
 */
export function useSalesPartnerItemList(
  params: SalesPartnerItemListParams = {},
  options?: Omit<UseQueryOptions<SalesPartnerItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.salesPartnerItem.list(params),
    queryFn: () => apiGet<SalesPartnerItem[]>(`/sales-partner-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Sales Partner Item by ID.
 */
export function useSalesPartnerItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SalesPartnerItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.salesPartnerItem.detail(id ?? ''),
    queryFn: () => apiGet<SalesPartnerItem | null>(`/sales-partner-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Sales Partner Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateSalesPartnerItem(
  options?: UseMutationOptions<SalesPartnerItem, Error, Partial<SalesPartnerItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SalesPartnerItem>) => apiPost<SalesPartnerItem>('/sales-partner-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesPartnerItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Sales Partner Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSalesPartnerItem(
  options?: UseMutationOptions<SalesPartnerItem, Error, { id: string; data: Partial<SalesPartnerItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SalesPartnerItem> }) =>
      apiPut<SalesPartnerItem>(`/sales-partner-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesPartnerItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.salesPartnerItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Sales Partner Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSalesPartnerItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/sales-partner-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesPartnerItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
