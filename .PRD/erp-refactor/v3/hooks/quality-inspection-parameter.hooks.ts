// TanStack Query hooks for Quality Inspection Parameter
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { QualityInspectionParameter } from '../types/quality-inspection-parameter.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface QualityInspectionParameterListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Quality Inspection Parameter records.
 */
export function useQualityInspectionParameterList(
  params: QualityInspectionParameterListParams = {},
  options?: Omit<UseQueryOptions<QualityInspectionParameter[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.qualityInspectionParameter.list(params),
    queryFn: () => apiGet<QualityInspectionParameter[]>(`/quality-inspection-parameter${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Quality Inspection Parameter by ID.
 */
export function useQualityInspectionParameter(
  id: string | undefined,
  options?: Omit<UseQueryOptions<QualityInspectionParameter | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.qualityInspectionParameter.detail(id ?? ''),
    queryFn: () => apiGet<QualityInspectionParameter | null>(`/quality-inspection-parameter/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Quality Inspection Parameter.
 * Automatically invalidates list queries on success.
 */
export function useCreateQualityInspectionParameter(
  options?: UseMutationOptions<QualityInspectionParameter, Error, Partial<QualityInspectionParameter>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<QualityInspectionParameter>) => apiPost<QualityInspectionParameter>('/quality-inspection-parameter', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityInspectionParameter.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Quality Inspection Parameter.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateQualityInspectionParameter(
  options?: UseMutationOptions<QualityInspectionParameter, Error, { id: string; data: Partial<QualityInspectionParameter> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<QualityInspectionParameter> }) =>
      apiPut<QualityInspectionParameter>(`/quality-inspection-parameter/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityInspectionParameter.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityInspectionParameter.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Quality Inspection Parameter by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteQualityInspectionParameter(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/quality-inspection-parameter/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityInspectionParameter.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
