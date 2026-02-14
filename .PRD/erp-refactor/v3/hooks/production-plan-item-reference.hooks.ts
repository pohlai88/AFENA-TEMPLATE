// TanStack Query hooks for Production Plan Item Reference
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ProductionPlanItemReference } from '../types/production-plan-item-reference.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ProductionPlanItemReferenceListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Production Plan Item Reference records.
 */
export function useProductionPlanItemReferenceList(
  params: ProductionPlanItemReferenceListParams = {},
  options?: Omit<UseQueryOptions<ProductionPlanItemReference[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.productionPlanItemReference.list(params),
    queryFn: () => apiGet<ProductionPlanItemReference[]>(`/production-plan-item-reference${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Production Plan Item Reference by ID.
 */
export function useProductionPlanItemReference(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ProductionPlanItemReference | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.productionPlanItemReference.detail(id ?? ''),
    queryFn: () => apiGet<ProductionPlanItemReference | null>(`/production-plan-item-reference/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Production Plan Item Reference.
 * Automatically invalidates list queries on success.
 */
export function useCreateProductionPlanItemReference(
  options?: UseMutationOptions<ProductionPlanItemReference, Error, Partial<ProductionPlanItemReference>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProductionPlanItemReference>) => apiPost<ProductionPlanItemReference>('/production-plan-item-reference', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlanItemReference.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Production Plan Item Reference.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateProductionPlanItemReference(
  options?: UseMutationOptions<ProductionPlanItemReference, Error, { id: string; data: Partial<ProductionPlanItemReference> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductionPlanItemReference> }) =>
      apiPut<ProductionPlanItemReference>(`/production-plan-item-reference/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlanItemReference.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlanItemReference.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Production Plan Item Reference by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteProductionPlanItemReference(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/production-plan-item-reference/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlanItemReference.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
