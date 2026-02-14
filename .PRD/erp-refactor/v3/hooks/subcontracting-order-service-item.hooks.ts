// TanStack Query hooks for Subcontracting Order Service Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SubcontractingOrderServiceItem } from '../types/subcontracting-order-service-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SubcontractingOrderServiceItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Subcontracting Order Service Item records.
 */
export function useSubcontractingOrderServiceItemList(
  params: SubcontractingOrderServiceItemListParams = {},
  options?: Omit<UseQueryOptions<SubcontractingOrderServiceItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.subcontractingOrderServiceItem.list(params),
    queryFn: () => apiGet<SubcontractingOrderServiceItem[]>(`/subcontracting-order-service-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Subcontracting Order Service Item by ID.
 */
export function useSubcontractingOrderServiceItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SubcontractingOrderServiceItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.subcontractingOrderServiceItem.detail(id ?? ''),
    queryFn: () => apiGet<SubcontractingOrderServiceItem | null>(`/subcontracting-order-service-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Subcontracting Order Service Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateSubcontractingOrderServiceItem(
  options?: UseMutationOptions<SubcontractingOrderServiceItem, Error, Partial<SubcontractingOrderServiceItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SubcontractingOrderServiceItem>) => apiPost<SubcontractingOrderServiceItem>('/subcontracting-order-service-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingOrderServiceItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Subcontracting Order Service Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSubcontractingOrderServiceItem(
  options?: UseMutationOptions<SubcontractingOrderServiceItem, Error, { id: string; data: Partial<SubcontractingOrderServiceItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SubcontractingOrderServiceItem> }) =>
      apiPut<SubcontractingOrderServiceItem>(`/subcontracting-order-service-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingOrderServiceItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingOrderServiceItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Subcontracting Order Service Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSubcontractingOrderServiceItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/subcontracting-order-service-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingOrderServiceItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
