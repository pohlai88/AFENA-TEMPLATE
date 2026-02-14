// TanStack Query hooks for Subcontracting Inward Order Received Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SubcontractingInwardOrderReceivedItem } from '../types/subcontracting-inward-order-received-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SubcontractingInwardOrderReceivedItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Subcontracting Inward Order Received Item records.
 */
export function useSubcontractingInwardOrderReceivedItemList(
  params: SubcontractingInwardOrderReceivedItemListParams = {},
  options?: Omit<UseQueryOptions<SubcontractingInwardOrderReceivedItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.subcontractingInwardOrderReceivedItem.list(params),
    queryFn: () => apiGet<SubcontractingInwardOrderReceivedItem[]>(`/subcontracting-inward-order-received-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Subcontracting Inward Order Received Item by ID.
 */
export function useSubcontractingInwardOrderReceivedItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SubcontractingInwardOrderReceivedItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.subcontractingInwardOrderReceivedItem.detail(id ?? ''),
    queryFn: () => apiGet<SubcontractingInwardOrderReceivedItem | null>(`/subcontracting-inward-order-received-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Subcontracting Inward Order Received Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateSubcontractingInwardOrderReceivedItem(
  options?: UseMutationOptions<SubcontractingInwardOrderReceivedItem, Error, Partial<SubcontractingInwardOrderReceivedItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SubcontractingInwardOrderReceivedItem>) => apiPost<SubcontractingInwardOrderReceivedItem>('/subcontracting-inward-order-received-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingInwardOrderReceivedItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Subcontracting Inward Order Received Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSubcontractingInwardOrderReceivedItem(
  options?: UseMutationOptions<SubcontractingInwardOrderReceivedItem, Error, { id: string; data: Partial<SubcontractingInwardOrderReceivedItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SubcontractingInwardOrderReceivedItem> }) =>
      apiPut<SubcontractingInwardOrderReceivedItem>(`/subcontracting-inward-order-received-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingInwardOrderReceivedItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingInwardOrderReceivedItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Subcontracting Inward Order Received Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSubcontractingInwardOrderReceivedItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/subcontracting-inward-order-received-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingInwardOrderReceivedItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
