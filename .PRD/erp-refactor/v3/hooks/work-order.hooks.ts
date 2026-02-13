// TanStack Query hooks for Work Order
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { WorkOrder } from '../types/work-order.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface WorkOrderListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Work Order records.
 */
export function useWorkOrderList(
  params: WorkOrderListParams = {},
  options?: Omit<UseQueryOptions<WorkOrder[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.workOrder.list(params),
    queryFn: () => apiGet<WorkOrder[]>(`/work-order${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Work Order by ID.
 */
export function useWorkOrder(
  id: string | undefined,
  options?: Omit<UseQueryOptions<WorkOrder | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.workOrder.detail(id ?? ''),
    queryFn: () => apiGet<WorkOrder | null>(`/work-order/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Work Order.
 * Automatically invalidates list queries on success.
 */
export function useCreateWorkOrder(
  options?: UseMutationOptions<WorkOrder, Error, Partial<WorkOrder>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<WorkOrder>) => apiPost<WorkOrder>('/work-order', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workOrder.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Work Order.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateWorkOrder(
  options?: UseMutationOptions<WorkOrder, Error, { id: string; data: Partial<WorkOrder> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WorkOrder> }) =>
      apiPut<WorkOrder>(`/work-order/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workOrder.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.workOrder.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Work Order by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteWorkOrder(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/work-order/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workOrder.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Work Order (set docstatus = 1).
 */
export function useSubmitWorkOrder(
  options?: UseMutationOptions<WorkOrder, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<WorkOrder>(`/work-order/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workOrder.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.workOrder.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Work Order (set docstatus = 2).
 */
export function useCancelWorkOrder(
  options?: UseMutationOptions<WorkOrder, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<WorkOrder>(`/work-order/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workOrder.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.workOrder.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
