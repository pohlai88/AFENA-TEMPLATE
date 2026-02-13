// TanStack Query hooks for Production Plan Material Request Warehouse
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ProductionPlanMaterialRequestWarehouse } from '../types/production-plan-material-request-warehouse.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ProductionPlanMaterialRequestWarehouseListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Production Plan Material Request Warehouse records.
 */
export function useProductionPlanMaterialRequestWarehouseList(
  params: ProductionPlanMaterialRequestWarehouseListParams = {},
  options?: Omit<UseQueryOptions<ProductionPlanMaterialRequestWarehouse[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.productionPlanMaterialRequestWarehouse.list(params),
    queryFn: () => apiGet<ProductionPlanMaterialRequestWarehouse[]>(`/production-plan-material-request-warehouse${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Production Plan Material Request Warehouse by ID.
 */
export function useProductionPlanMaterialRequestWarehouse(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ProductionPlanMaterialRequestWarehouse | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.productionPlanMaterialRequestWarehouse.detail(id ?? ''),
    queryFn: () => apiGet<ProductionPlanMaterialRequestWarehouse | null>(`/production-plan-material-request-warehouse/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Production Plan Material Request Warehouse.
 * Automatically invalidates list queries on success.
 */
export function useCreateProductionPlanMaterialRequestWarehouse(
  options?: UseMutationOptions<ProductionPlanMaterialRequestWarehouse, Error, Partial<ProductionPlanMaterialRequestWarehouse>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProductionPlanMaterialRequestWarehouse>) => apiPost<ProductionPlanMaterialRequestWarehouse>('/production-plan-material-request-warehouse', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlanMaterialRequestWarehouse.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Production Plan Material Request Warehouse.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateProductionPlanMaterialRequestWarehouse(
  options?: UseMutationOptions<ProductionPlanMaterialRequestWarehouse, Error, { id: string; data: Partial<ProductionPlanMaterialRequestWarehouse> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductionPlanMaterialRequestWarehouse> }) =>
      apiPut<ProductionPlanMaterialRequestWarehouse>(`/production-plan-material-request-warehouse/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlanMaterialRequestWarehouse.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlanMaterialRequestWarehouse.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Production Plan Material Request Warehouse by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteProductionPlanMaterialRequestWarehouse(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/production-plan-material-request-warehouse/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlanMaterialRequestWarehouse.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
