// TanStack Query hooks for Supplier Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SupplierItem } from '../types/supplier-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SupplierItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Supplier Item records.
 */
export function useSupplierItemList(
  params: SupplierItemListParams = {},
  options?: Omit<UseQueryOptions<SupplierItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.supplierItem.list(params),
    queryFn: () => apiGet<SupplierItem[]>(`/supplier-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Supplier Item by ID.
 */
export function useSupplierItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SupplierItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.supplierItem.detail(id ?? ''),
    queryFn: () => apiGet<SupplierItem | null>(`/supplier-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Supplier Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateSupplierItem(
  options?: UseMutationOptions<SupplierItem, Error, Partial<SupplierItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SupplierItem>) => apiPost<SupplierItem>('/supplier-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Supplier Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSupplierItem(
  options?: UseMutationOptions<SupplierItem, Error, { id: string; data: Partial<SupplierItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SupplierItem> }) =>
      apiPut<SupplierItem>(`/supplier-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Supplier Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSupplierItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/supplier-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
