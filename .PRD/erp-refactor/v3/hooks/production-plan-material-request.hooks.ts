// TanStack Query hooks for Production Plan Material Request
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ProductionPlanMaterialRequest } from '../types/production-plan-material-request.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ProductionPlanMaterialRequestListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Production Plan Material Request records.
 */
export function useProductionPlanMaterialRequestList(
  params: ProductionPlanMaterialRequestListParams = {},
  options?: Omit<UseQueryOptions<ProductionPlanMaterialRequest[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.productionPlanMaterialRequest.list(params),
    queryFn: () => apiGet<ProductionPlanMaterialRequest[]>(`/production-plan-material-request${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Production Plan Material Request by ID.
 */
export function useProductionPlanMaterialRequest(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ProductionPlanMaterialRequest | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.productionPlanMaterialRequest.detail(id ?? ''),
    queryFn: () => apiGet<ProductionPlanMaterialRequest | null>(`/production-plan-material-request/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Production Plan Material Request.
 * Automatically invalidates list queries on success.
 */
export function useCreateProductionPlanMaterialRequest(
  options?: UseMutationOptions<ProductionPlanMaterialRequest, Error, Partial<ProductionPlanMaterialRequest>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProductionPlanMaterialRequest>) => apiPost<ProductionPlanMaterialRequest>('/production-plan-material-request', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlanMaterialRequest.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Production Plan Material Request.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateProductionPlanMaterialRequest(
  options?: UseMutationOptions<ProductionPlanMaterialRequest, Error, { id: string; data: Partial<ProductionPlanMaterialRequest> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductionPlanMaterialRequest> }) =>
      apiPut<ProductionPlanMaterialRequest>(`/production-plan-material-request/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlanMaterialRequest.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlanMaterialRequest.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Production Plan Material Request by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteProductionPlanMaterialRequest(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/production-plan-material-request/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlanMaterialRequest.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
