// TanStack Query hooks for Subcontracting Order
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SubcontractingOrder } from '../types/subcontracting-order.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SubcontractingOrderListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Subcontracting Order records.
 */
export function useSubcontractingOrderList(
  params: SubcontractingOrderListParams = {},
  options?: Omit<UseQueryOptions<SubcontractingOrder[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.subcontractingOrder.list(params),
    queryFn: () => apiGet<SubcontractingOrder[]>(`/subcontracting-order${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Subcontracting Order by ID.
 */
export function useSubcontractingOrder(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SubcontractingOrder | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.subcontractingOrder.detail(id ?? ''),
    queryFn: () => apiGet<SubcontractingOrder | null>(`/subcontracting-order/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Subcontracting Order.
 * Automatically invalidates list queries on success.
 */
export function useCreateSubcontractingOrder(
  options?: UseMutationOptions<SubcontractingOrder, Error, Partial<SubcontractingOrder>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SubcontractingOrder>) => apiPost<SubcontractingOrder>('/subcontracting-order', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingOrder.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Subcontracting Order.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSubcontractingOrder(
  options?: UseMutationOptions<SubcontractingOrder, Error, { id: string; data: Partial<SubcontractingOrder> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SubcontractingOrder> }) =>
      apiPut<SubcontractingOrder>(`/subcontracting-order/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingOrder.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingOrder.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Subcontracting Order by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSubcontractingOrder(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/subcontracting-order/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingOrder.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Subcontracting Order (set docstatus = 1).
 */
export function useSubmitSubcontractingOrder(
  options?: UseMutationOptions<SubcontractingOrder, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<SubcontractingOrder>(`/subcontracting-order/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingOrder.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingOrder.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Subcontracting Order (set docstatus = 2).
 */
export function useCancelSubcontractingOrder(
  options?: UseMutationOptions<SubcontractingOrder, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<SubcontractingOrder>(`/subcontracting-order/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingOrder.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingOrder.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
