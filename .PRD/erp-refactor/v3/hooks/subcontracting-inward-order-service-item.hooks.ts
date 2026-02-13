// TanStack Query hooks for Subcontracting Inward Order Service Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SubcontractingInwardOrderServiceItem } from '../types/subcontracting-inward-order-service-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SubcontractingInwardOrderServiceItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Subcontracting Inward Order Service Item records.
 */
export function useSubcontractingInwardOrderServiceItemList(
  params: SubcontractingInwardOrderServiceItemListParams = {},
  options?: Omit<UseQueryOptions<SubcontractingInwardOrderServiceItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.subcontractingInwardOrderServiceItem.list(params),
    queryFn: () => apiGet<SubcontractingInwardOrderServiceItem[]>(`/subcontracting-inward-order-service-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Subcontracting Inward Order Service Item by ID.
 */
export function useSubcontractingInwardOrderServiceItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SubcontractingInwardOrderServiceItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.subcontractingInwardOrderServiceItem.detail(id ?? ''),
    queryFn: () => apiGet<SubcontractingInwardOrderServiceItem | null>(`/subcontracting-inward-order-service-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Subcontracting Inward Order Service Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateSubcontractingInwardOrderServiceItem(
  options?: UseMutationOptions<SubcontractingInwardOrderServiceItem, Error, Partial<SubcontractingInwardOrderServiceItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SubcontractingInwardOrderServiceItem>) => apiPost<SubcontractingInwardOrderServiceItem>('/subcontracting-inward-order-service-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingInwardOrderServiceItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Subcontracting Inward Order Service Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSubcontractingInwardOrderServiceItem(
  options?: UseMutationOptions<SubcontractingInwardOrderServiceItem, Error, { id: string; data: Partial<SubcontractingInwardOrderServiceItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SubcontractingInwardOrderServiceItem> }) =>
      apiPut<SubcontractingInwardOrderServiceItem>(`/subcontracting-inward-order-service-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingInwardOrderServiceItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingInwardOrderServiceItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Subcontracting Inward Order Service Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSubcontractingInwardOrderServiceItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/subcontracting-inward-order-service-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingInwardOrderServiceItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
