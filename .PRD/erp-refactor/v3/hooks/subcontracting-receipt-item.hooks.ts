// TanStack Query hooks for Subcontracting Receipt Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SubcontractingReceiptItem } from '../types/subcontracting-receipt-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SubcontractingReceiptItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Subcontracting Receipt Item records.
 */
export function useSubcontractingReceiptItemList(
  params: SubcontractingReceiptItemListParams = {},
  options?: Omit<UseQueryOptions<SubcontractingReceiptItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.subcontractingReceiptItem.list(params),
    queryFn: () => apiGet<SubcontractingReceiptItem[]>(`/subcontracting-receipt-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Subcontracting Receipt Item by ID.
 */
export function useSubcontractingReceiptItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SubcontractingReceiptItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.subcontractingReceiptItem.detail(id ?? ''),
    queryFn: () => apiGet<SubcontractingReceiptItem | null>(`/subcontracting-receipt-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Subcontracting Receipt Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateSubcontractingReceiptItem(
  options?: UseMutationOptions<SubcontractingReceiptItem, Error, Partial<SubcontractingReceiptItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SubcontractingReceiptItem>) => apiPost<SubcontractingReceiptItem>('/subcontracting-receipt-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingReceiptItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Subcontracting Receipt Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSubcontractingReceiptItem(
  options?: UseMutationOptions<SubcontractingReceiptItem, Error, { id: string; data: Partial<SubcontractingReceiptItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SubcontractingReceiptItem> }) =>
      apiPut<SubcontractingReceiptItem>(`/subcontracting-receipt-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingReceiptItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingReceiptItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Subcontracting Receipt Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSubcontractingReceiptItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/subcontracting-receipt-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingReceiptItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
