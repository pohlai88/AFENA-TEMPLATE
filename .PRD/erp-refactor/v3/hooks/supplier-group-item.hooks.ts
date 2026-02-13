// TanStack Query hooks for Supplier Group Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SupplierGroupItem } from '../types/supplier-group-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SupplierGroupItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Supplier Group Item records.
 */
export function useSupplierGroupItemList(
  params: SupplierGroupItemListParams = {},
  options?: Omit<UseQueryOptions<SupplierGroupItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.supplierGroupItem.list(params),
    queryFn: () => apiGet<SupplierGroupItem[]>(`/supplier-group-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Supplier Group Item by ID.
 */
export function useSupplierGroupItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SupplierGroupItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.supplierGroupItem.detail(id ?? ''),
    queryFn: () => apiGet<SupplierGroupItem | null>(`/supplier-group-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Supplier Group Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateSupplierGroupItem(
  options?: UseMutationOptions<SupplierGroupItem, Error, Partial<SupplierGroupItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SupplierGroupItem>) => apiPost<SupplierGroupItem>('/supplier-group-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierGroupItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Supplier Group Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSupplierGroupItem(
  options?: UseMutationOptions<SupplierGroupItem, Error, { id: string; data: Partial<SupplierGroupItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SupplierGroupItem> }) =>
      apiPut<SupplierGroupItem>(`/supplier-group-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierGroupItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierGroupItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Supplier Group Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSupplierGroupItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/supplier-group-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierGroupItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
