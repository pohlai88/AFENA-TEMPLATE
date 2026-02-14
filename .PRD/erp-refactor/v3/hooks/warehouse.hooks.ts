// TanStack Query hooks for Warehouse
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Warehouse } from '../types/warehouse.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface WarehouseListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Warehouse records.
 */
export function useWarehouseList(
  params: WarehouseListParams = {},
  options?: Omit<UseQueryOptions<Warehouse[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.warehouse.list(params),
    queryFn: () => apiGet<Warehouse[]>(`/warehouse${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Warehouse by ID.
 */
export function useWarehouse(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Warehouse | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.warehouse.detail(id ?? ''),
    queryFn: () => apiGet<Warehouse | null>(`/warehouse/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Warehouse.
 * Automatically invalidates list queries on success.
 */
export function useCreateWarehouse(
  options?: UseMutationOptions<Warehouse, Error, Partial<Warehouse>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Warehouse>) => apiPost<Warehouse>('/warehouse', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.warehouse.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Warehouse.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateWarehouse(
  options?: UseMutationOptions<Warehouse, Error, { id: string; data: Partial<Warehouse> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Warehouse> }) =>
      apiPut<Warehouse>(`/warehouse/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.warehouse.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.warehouse.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Warehouse by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteWarehouse(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/warehouse/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.warehouse.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
