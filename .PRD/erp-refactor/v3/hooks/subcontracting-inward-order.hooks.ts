// TanStack Query hooks for Subcontracting Inward Order
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SubcontractingInwardOrder } from '../types/subcontracting-inward-order.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SubcontractingInwardOrderListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Subcontracting Inward Order records.
 */
export function useSubcontractingInwardOrderList(
  params: SubcontractingInwardOrderListParams = {},
  options?: Omit<UseQueryOptions<SubcontractingInwardOrder[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.subcontractingInwardOrder.list(params),
    queryFn: () => apiGet<SubcontractingInwardOrder[]>(`/subcontracting-inward-order${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Subcontracting Inward Order by ID.
 */
export function useSubcontractingInwardOrder(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SubcontractingInwardOrder | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.subcontractingInwardOrder.detail(id ?? ''),
    queryFn: () => apiGet<SubcontractingInwardOrder | null>(`/subcontracting-inward-order/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Subcontracting Inward Order.
 * Automatically invalidates list queries on success.
 */
export function useCreateSubcontractingInwardOrder(
  options?: UseMutationOptions<SubcontractingInwardOrder, Error, Partial<SubcontractingInwardOrder>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SubcontractingInwardOrder>) => apiPost<SubcontractingInwardOrder>('/subcontracting-inward-order', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingInwardOrder.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Subcontracting Inward Order.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSubcontractingInwardOrder(
  options?: UseMutationOptions<SubcontractingInwardOrder, Error, { id: string; data: Partial<SubcontractingInwardOrder> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SubcontractingInwardOrder> }) =>
      apiPut<SubcontractingInwardOrder>(`/subcontracting-inward-order/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingInwardOrder.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingInwardOrder.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Subcontracting Inward Order by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSubcontractingInwardOrder(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/subcontracting-inward-order/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingInwardOrder.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Subcontracting Inward Order (set docstatus = 1).
 */
export function useSubmitSubcontractingInwardOrder(
  options?: UseMutationOptions<SubcontractingInwardOrder, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<SubcontractingInwardOrder>(`/subcontracting-inward-order/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingInwardOrder.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingInwardOrder.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Subcontracting Inward Order (set docstatus = 2).
 */
export function useCancelSubcontractingInwardOrder(
  options?: UseMutationOptions<SubcontractingInwardOrder, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<SubcontractingInwardOrder>(`/subcontracting-inward-order/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingInwardOrder.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingInwardOrder.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
