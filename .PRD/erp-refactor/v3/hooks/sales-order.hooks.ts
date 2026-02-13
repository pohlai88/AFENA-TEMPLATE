// TanStack Query hooks for Sales Order
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SalesOrder } from '../types/sales-order.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SalesOrderListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Sales Order records.
 */
export function useSalesOrderList(
  params: SalesOrderListParams = {},
  options?: Omit<UseQueryOptions<SalesOrder[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.salesOrder.list(params),
    queryFn: () => apiGet<SalesOrder[]>(`/sales-order${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Sales Order by ID.
 */
export function useSalesOrder(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SalesOrder | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.salesOrder.detail(id ?? ''),
    queryFn: () => apiGet<SalesOrder | null>(`/sales-order/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Sales Order.
 * Automatically invalidates list queries on success.
 */
export function useCreateSalesOrder(
  options?: UseMutationOptions<SalesOrder, Error, Partial<SalesOrder>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SalesOrder>) => apiPost<SalesOrder>('/sales-order', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesOrder.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Sales Order.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSalesOrder(
  options?: UseMutationOptions<SalesOrder, Error, { id: string; data: Partial<SalesOrder> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SalesOrder> }) =>
      apiPut<SalesOrder>(`/sales-order/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesOrder.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.salesOrder.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Sales Order by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSalesOrder(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/sales-order/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesOrder.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Sales Order (set docstatus = 1).
 */
export function useSubmitSalesOrder(
  options?: UseMutationOptions<SalesOrder, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<SalesOrder>(`/sales-order/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesOrder.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.salesOrder.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Sales Order (set docstatus = 2).
 */
export function useCancelSalesOrder(
  options?: UseMutationOptions<SalesOrder, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<SalesOrder>(`/sales-order/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesOrder.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.salesOrder.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
