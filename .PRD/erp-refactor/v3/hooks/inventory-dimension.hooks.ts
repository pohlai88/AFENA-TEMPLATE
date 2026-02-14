// TanStack Query hooks for Inventory Dimension
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { InventoryDimension } from '../types/inventory-dimension.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface InventoryDimensionListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Inventory Dimension records.
 */
export function useInventoryDimensionList(
  params: InventoryDimensionListParams = {},
  options?: Omit<UseQueryOptions<InventoryDimension[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.inventoryDimension.list(params),
    queryFn: () => apiGet<InventoryDimension[]>(`/inventory-dimension${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Inventory Dimension by ID.
 */
export function useInventoryDimension(
  id: string | undefined,
  options?: Omit<UseQueryOptions<InventoryDimension | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.inventoryDimension.detail(id ?? ''),
    queryFn: () => apiGet<InventoryDimension | null>(`/inventory-dimension/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Inventory Dimension.
 * Automatically invalidates list queries on success.
 */
export function useCreateInventoryDimension(
  options?: UseMutationOptions<InventoryDimension, Error, Partial<InventoryDimension>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<InventoryDimension>) => apiPost<InventoryDimension>('/inventory-dimension', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventoryDimension.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Inventory Dimension.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateInventoryDimension(
  options?: UseMutationOptions<InventoryDimension, Error, { id: string; data: Partial<InventoryDimension> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InventoryDimension> }) =>
      apiPut<InventoryDimension>(`/inventory-dimension/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventoryDimension.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventoryDimension.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Inventory Dimension by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteInventoryDimension(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/inventory-dimension/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventoryDimension.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
