// TanStack Query hooks for Blanket Order
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BlanketOrder } from '../types/blanket-order.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BlanketOrderListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Blanket Order records.
 */
export function useBlanketOrderList(
  params: BlanketOrderListParams = {},
  options?: Omit<UseQueryOptions<BlanketOrder[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.blanketOrder.list(params),
    queryFn: () => apiGet<BlanketOrder[]>(`/blanket-order${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Blanket Order by ID.
 */
export function useBlanketOrder(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BlanketOrder | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.blanketOrder.detail(id ?? ''),
    queryFn: () => apiGet<BlanketOrder | null>(`/blanket-order/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Blanket Order.
 * Automatically invalidates list queries on success.
 */
export function useCreateBlanketOrder(
  options?: UseMutationOptions<BlanketOrder, Error, Partial<BlanketOrder>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BlanketOrder>) => apiPost<BlanketOrder>('/blanket-order', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blanketOrder.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Blanket Order.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBlanketOrder(
  options?: UseMutationOptions<BlanketOrder, Error, { id: string; data: Partial<BlanketOrder> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BlanketOrder> }) =>
      apiPut<BlanketOrder>(`/blanket-order/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blanketOrder.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.blanketOrder.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Blanket Order by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBlanketOrder(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/blanket-order/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blanketOrder.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Blanket Order (set docstatus = 1).
 */
export function useSubmitBlanketOrder(
  options?: UseMutationOptions<BlanketOrder, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<BlanketOrder>(`/blanket-order/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blanketOrder.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.blanketOrder.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Blanket Order (set docstatus = 2).
 */
export function useCancelBlanketOrder(
  options?: UseMutationOptions<BlanketOrder, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<BlanketOrder>(`/blanket-order/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blanketOrder.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.blanketOrder.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
