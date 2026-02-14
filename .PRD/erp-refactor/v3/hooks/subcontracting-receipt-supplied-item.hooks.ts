// TanStack Query hooks for Subcontracting Receipt Supplied Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SubcontractingReceiptSuppliedItem } from '../types/subcontracting-receipt-supplied-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SubcontractingReceiptSuppliedItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Subcontracting Receipt Supplied Item records.
 */
export function useSubcontractingReceiptSuppliedItemList(
  params: SubcontractingReceiptSuppliedItemListParams = {},
  options?: Omit<UseQueryOptions<SubcontractingReceiptSuppliedItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.subcontractingReceiptSuppliedItem.list(params),
    queryFn: () => apiGet<SubcontractingReceiptSuppliedItem[]>(`/subcontracting-receipt-supplied-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Subcontracting Receipt Supplied Item by ID.
 */
export function useSubcontractingReceiptSuppliedItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SubcontractingReceiptSuppliedItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.subcontractingReceiptSuppliedItem.detail(id ?? ''),
    queryFn: () => apiGet<SubcontractingReceiptSuppliedItem | null>(`/subcontracting-receipt-supplied-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Subcontracting Receipt Supplied Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateSubcontractingReceiptSuppliedItem(
  options?: UseMutationOptions<SubcontractingReceiptSuppliedItem, Error, Partial<SubcontractingReceiptSuppliedItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SubcontractingReceiptSuppliedItem>) => apiPost<SubcontractingReceiptSuppliedItem>('/subcontracting-receipt-supplied-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingReceiptSuppliedItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Subcontracting Receipt Supplied Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSubcontractingReceiptSuppliedItem(
  options?: UseMutationOptions<SubcontractingReceiptSuppliedItem, Error, { id: string; data: Partial<SubcontractingReceiptSuppliedItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SubcontractingReceiptSuppliedItem> }) =>
      apiPut<SubcontractingReceiptSuppliedItem>(`/subcontracting-receipt-supplied-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingReceiptSuppliedItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingReceiptSuppliedItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Subcontracting Receipt Supplied Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSubcontractingReceiptSuppliedItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/subcontracting-receipt-supplied-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingReceiptSuppliedItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
