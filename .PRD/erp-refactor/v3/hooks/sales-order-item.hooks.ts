// TanStack Query hooks for Sales Order Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SalesOrderItem } from '../types/sales-order-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SalesOrderItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Sales Order Item records.
 */
export function useSalesOrderItemList(
  params: SalesOrderItemListParams = {},
  options?: Omit<UseQueryOptions<SalesOrderItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.salesOrderItem.list(params),
    queryFn: () => apiGet<SalesOrderItem[]>(`/sales-order-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Sales Order Item by ID.
 */
export function useSalesOrderItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SalesOrderItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.salesOrderItem.detail(id ?? ''),
    queryFn: () => apiGet<SalesOrderItem | null>(`/sales-order-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Sales Order Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateSalesOrderItem(
  options?: UseMutationOptions<SalesOrderItem, Error, Partial<SalesOrderItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SalesOrderItem>) => apiPost<SalesOrderItem>('/sales-order-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesOrderItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Sales Order Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSalesOrderItem(
  options?: UseMutationOptions<SalesOrderItem, Error, { id: string; data: Partial<SalesOrderItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SalesOrderItem> }) =>
      apiPut<SalesOrderItem>(`/sales-order-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesOrderItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.salesOrderItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Sales Order Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSalesOrderItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/sales-order-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesOrderItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
