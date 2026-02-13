// TanStack Query hooks for Subcontracting Order Supplied Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SubcontractingOrderSuppliedItem } from '../types/subcontracting-order-supplied-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SubcontractingOrderSuppliedItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Subcontracting Order Supplied Item records.
 */
export function useSubcontractingOrderSuppliedItemList(
  params: SubcontractingOrderSuppliedItemListParams = {},
  options?: Omit<UseQueryOptions<SubcontractingOrderSuppliedItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.subcontractingOrderSuppliedItem.list(params),
    queryFn: () => apiGet<SubcontractingOrderSuppliedItem[]>(`/subcontracting-order-supplied-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Subcontracting Order Supplied Item by ID.
 */
export function useSubcontractingOrderSuppliedItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SubcontractingOrderSuppliedItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.subcontractingOrderSuppliedItem.detail(id ?? ''),
    queryFn: () => apiGet<SubcontractingOrderSuppliedItem | null>(`/subcontracting-order-supplied-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Subcontracting Order Supplied Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateSubcontractingOrderSuppliedItem(
  options?: UseMutationOptions<SubcontractingOrderSuppliedItem, Error, Partial<SubcontractingOrderSuppliedItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SubcontractingOrderSuppliedItem>) => apiPost<SubcontractingOrderSuppliedItem>('/subcontracting-order-supplied-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingOrderSuppliedItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Subcontracting Order Supplied Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSubcontractingOrderSuppliedItem(
  options?: UseMutationOptions<SubcontractingOrderSuppliedItem, Error, { id: string; data: Partial<SubcontractingOrderSuppliedItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SubcontractingOrderSuppliedItem> }) =>
      apiPut<SubcontractingOrderSuppliedItem>(`/subcontracting-order-supplied-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingOrderSuppliedItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingOrderSuppliedItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Subcontracting Order Supplied Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSubcontractingOrderSuppliedItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/subcontracting-order-supplied-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingOrderSuppliedItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
