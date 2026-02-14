// TanStack Query hooks for UOM Conversion Factor
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { UomConversionFactor } from '../types/uom-conversion-factor.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface UomConversionFactorListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of UOM Conversion Factor records.
 */
export function useUomConversionFactorList(
  params: UomConversionFactorListParams = {},
  options?: Omit<UseQueryOptions<UomConversionFactor[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.uomConversionFactor.list(params),
    queryFn: () => apiGet<UomConversionFactor[]>(`/uom-conversion-factor${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single UOM Conversion Factor by ID.
 */
export function useUomConversionFactor(
  id: string | undefined,
  options?: Omit<UseQueryOptions<UomConversionFactor | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.uomConversionFactor.detail(id ?? ''),
    queryFn: () => apiGet<UomConversionFactor | null>(`/uom-conversion-factor/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new UOM Conversion Factor.
 * Automatically invalidates list queries on success.
 */
export function useCreateUomConversionFactor(
  options?: UseMutationOptions<UomConversionFactor, Error, Partial<UomConversionFactor>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<UomConversionFactor>) => apiPost<UomConversionFactor>('/uom-conversion-factor', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.uomConversionFactor.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing UOM Conversion Factor.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateUomConversionFactor(
  options?: UseMutationOptions<UomConversionFactor, Error, { id: string; data: Partial<UomConversionFactor> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UomConversionFactor> }) =>
      apiPut<UomConversionFactor>(`/uom-conversion-factor/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.uomConversionFactor.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.uomConversionFactor.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a UOM Conversion Factor by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteUomConversionFactor(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/uom-conversion-factor/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.uomConversionFactor.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
