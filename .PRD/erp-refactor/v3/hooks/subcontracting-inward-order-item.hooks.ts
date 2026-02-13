// TanStack Query hooks for Subcontracting Inward Order Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SubcontractingInwardOrderItem } from '../types/subcontracting-inward-order-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SubcontractingInwardOrderItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Subcontracting Inward Order Item records.
 */
export function useSubcontractingInwardOrderItemList(
  params: SubcontractingInwardOrderItemListParams = {},
  options?: Omit<UseQueryOptions<SubcontractingInwardOrderItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.subcontractingInwardOrderItem.list(params),
    queryFn: () => apiGet<SubcontractingInwardOrderItem[]>(`/subcontracting-inward-order-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Subcontracting Inward Order Item by ID.
 */
export function useSubcontractingInwardOrderItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SubcontractingInwardOrderItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.subcontractingInwardOrderItem.detail(id ?? ''),
    queryFn: () => apiGet<SubcontractingInwardOrderItem | null>(`/subcontracting-inward-order-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Subcontracting Inward Order Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateSubcontractingInwardOrderItem(
  options?: UseMutationOptions<SubcontractingInwardOrderItem, Error, Partial<SubcontractingInwardOrderItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SubcontractingInwardOrderItem>) => apiPost<SubcontractingInwardOrderItem>('/subcontracting-inward-order-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingInwardOrderItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Subcontracting Inward Order Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSubcontractingInwardOrderItem(
  options?: UseMutationOptions<SubcontractingInwardOrderItem, Error, { id: string; data: Partial<SubcontractingInwardOrderItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SubcontractingInwardOrderItem> }) =>
      apiPut<SubcontractingInwardOrderItem>(`/subcontracting-inward-order-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingInwardOrderItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingInwardOrderItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Subcontracting Inward Order Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSubcontractingInwardOrderItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/subcontracting-inward-order-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingInwardOrderItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
