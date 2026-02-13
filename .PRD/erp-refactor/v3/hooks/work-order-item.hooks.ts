// TanStack Query hooks for Work Order Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { WorkOrderItem } from '../types/work-order-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface WorkOrderItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Work Order Item records.
 */
export function useWorkOrderItemList(
  params: WorkOrderItemListParams = {},
  options?: Omit<UseQueryOptions<WorkOrderItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.workOrderItem.list(params),
    queryFn: () => apiGet<WorkOrderItem[]>(`/work-order-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Work Order Item by ID.
 */
export function useWorkOrderItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<WorkOrderItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.workOrderItem.detail(id ?? ''),
    queryFn: () => apiGet<WorkOrderItem | null>(`/work-order-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Work Order Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateWorkOrderItem(
  options?: UseMutationOptions<WorkOrderItem, Error, Partial<WorkOrderItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<WorkOrderItem>) => apiPost<WorkOrderItem>('/work-order-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workOrderItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Work Order Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateWorkOrderItem(
  options?: UseMutationOptions<WorkOrderItem, Error, { id: string; data: Partial<WorkOrderItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WorkOrderItem> }) =>
      apiPut<WorkOrderItem>(`/work-order-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workOrderItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.workOrderItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Work Order Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteWorkOrderItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/work-order-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workOrderItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
