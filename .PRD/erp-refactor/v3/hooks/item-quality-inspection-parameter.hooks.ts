// TanStack Query hooks for Item Quality Inspection Parameter
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ItemQualityInspectionParameter } from '../types/item-quality-inspection-parameter.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ItemQualityInspectionParameterListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Item Quality Inspection Parameter records.
 */
export function useItemQualityInspectionParameterList(
  params: ItemQualityInspectionParameterListParams = {},
  options?: Omit<UseQueryOptions<ItemQualityInspectionParameter[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.itemQualityInspectionParameter.list(params),
    queryFn: () => apiGet<ItemQualityInspectionParameter[]>(`/item-quality-inspection-parameter${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Item Quality Inspection Parameter by ID.
 */
export function useItemQualityInspectionParameter(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ItemQualityInspectionParameter | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.itemQualityInspectionParameter.detail(id ?? ''),
    queryFn: () => apiGet<ItemQualityInspectionParameter | null>(`/item-quality-inspection-parameter/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Item Quality Inspection Parameter.
 * Automatically invalidates list queries on success.
 */
export function useCreateItemQualityInspectionParameter(
  options?: UseMutationOptions<ItemQualityInspectionParameter, Error, Partial<ItemQualityInspectionParameter>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ItemQualityInspectionParameter>) => apiPost<ItemQualityInspectionParameter>('/item-quality-inspection-parameter', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemQualityInspectionParameter.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Item Quality Inspection Parameter.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateItemQualityInspectionParameter(
  options?: UseMutationOptions<ItemQualityInspectionParameter, Error, { id: string; data: Partial<ItemQualityInspectionParameter> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItemQualityInspectionParameter> }) =>
      apiPut<ItemQualityInspectionParameter>(`/item-quality-inspection-parameter/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemQualityInspectionParameter.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.itemQualityInspectionParameter.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Item Quality Inspection Parameter by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteItemQualityInspectionParameter(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/item-quality-inspection-parameter/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemQualityInspectionParameter.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
