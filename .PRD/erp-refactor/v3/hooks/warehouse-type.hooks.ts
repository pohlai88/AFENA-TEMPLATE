// TanStack Query hooks for Warehouse Type
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { WarehouseType } from '../types/warehouse-type.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface WarehouseTypeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Warehouse Type records.
 */
export function useWarehouseTypeList(
  params: WarehouseTypeListParams = {},
  options?: Omit<UseQueryOptions<WarehouseType[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.warehouseType.list(params),
    queryFn: () => apiGet<WarehouseType[]>(`/warehouse-type${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Warehouse Type by ID.
 */
export function useWarehouseType(
  id: string | undefined,
  options?: Omit<UseQueryOptions<WarehouseType | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.warehouseType.detail(id ?? ''),
    queryFn: () => apiGet<WarehouseType | null>(`/warehouse-type/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Warehouse Type.
 * Automatically invalidates list queries on success.
 */
export function useCreateWarehouseType(
  options?: UseMutationOptions<WarehouseType, Error, Partial<WarehouseType>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<WarehouseType>) => apiPost<WarehouseType>('/warehouse-type', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.warehouseType.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Warehouse Type.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateWarehouseType(
  options?: UseMutationOptions<WarehouseType, Error, { id: string; data: Partial<WarehouseType> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WarehouseType> }) =>
      apiPut<WarehouseType>(`/warehouse-type/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.warehouseType.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.warehouseType.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Warehouse Type by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteWarehouseType(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/warehouse-type/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.warehouseType.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
