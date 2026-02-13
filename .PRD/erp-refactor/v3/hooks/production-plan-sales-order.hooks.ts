// TanStack Query hooks for Production Plan Sales Order
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ProductionPlanSalesOrder } from '../types/production-plan-sales-order.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ProductionPlanSalesOrderListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Production Plan Sales Order records.
 */
export function useProductionPlanSalesOrderList(
  params: ProductionPlanSalesOrderListParams = {},
  options?: Omit<UseQueryOptions<ProductionPlanSalesOrder[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.productionPlanSalesOrder.list(params),
    queryFn: () => apiGet<ProductionPlanSalesOrder[]>(`/production-plan-sales-order${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Production Plan Sales Order by ID.
 */
export function useProductionPlanSalesOrder(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ProductionPlanSalesOrder | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.productionPlanSalesOrder.detail(id ?? ''),
    queryFn: () => apiGet<ProductionPlanSalesOrder | null>(`/production-plan-sales-order/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Production Plan Sales Order.
 * Automatically invalidates list queries on success.
 */
export function useCreateProductionPlanSalesOrder(
  options?: UseMutationOptions<ProductionPlanSalesOrder, Error, Partial<ProductionPlanSalesOrder>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProductionPlanSalesOrder>) => apiPost<ProductionPlanSalesOrder>('/production-plan-sales-order', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlanSalesOrder.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Production Plan Sales Order.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateProductionPlanSalesOrder(
  options?: UseMutationOptions<ProductionPlanSalesOrder, Error, { id: string; data: Partial<ProductionPlanSalesOrder> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductionPlanSalesOrder> }) =>
      apiPut<ProductionPlanSalesOrder>(`/production-plan-sales-order/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlanSalesOrder.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlanSalesOrder.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Production Plan Sales Order by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteProductionPlanSalesOrder(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/production-plan-sales-order/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlanSalesOrder.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
