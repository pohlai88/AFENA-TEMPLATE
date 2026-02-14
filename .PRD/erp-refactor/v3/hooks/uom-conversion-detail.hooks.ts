// TanStack Query hooks for UOM Conversion Detail
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { UomConversionDetail } from '../types/uom-conversion-detail.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface UomConversionDetailListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of UOM Conversion Detail records.
 */
export function useUomConversionDetailList(
  params: UomConversionDetailListParams = {},
  options?: Omit<UseQueryOptions<UomConversionDetail[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.uomConversionDetail.list(params),
    queryFn: () => apiGet<UomConversionDetail[]>(`/uom-conversion-detail${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single UOM Conversion Detail by ID.
 */
export function useUomConversionDetail(
  id: string | undefined,
  options?: Omit<UseQueryOptions<UomConversionDetail | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.uomConversionDetail.detail(id ?? ''),
    queryFn: () => apiGet<UomConversionDetail | null>(`/uom-conversion-detail/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new UOM Conversion Detail.
 * Automatically invalidates list queries on success.
 */
export function useCreateUomConversionDetail(
  options?: UseMutationOptions<UomConversionDetail, Error, Partial<UomConversionDetail>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<UomConversionDetail>) => apiPost<UomConversionDetail>('/uom-conversion-detail', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.uomConversionDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing UOM Conversion Detail.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateUomConversionDetail(
  options?: UseMutationOptions<UomConversionDetail, Error, { id: string; data: Partial<UomConversionDetail> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UomConversionDetail> }) =>
      apiPut<UomConversionDetail>(`/uom-conversion-detail/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.uomConversionDetail.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.uomConversionDetail.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a UOM Conversion Detail by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteUomConversionDetail(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/uom-conversion-detail/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.uomConversionDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
