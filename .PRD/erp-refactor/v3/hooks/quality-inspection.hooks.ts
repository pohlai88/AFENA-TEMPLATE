// TanStack Query hooks for Quality Inspection
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { QualityInspection } from '../types/quality-inspection.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface QualityInspectionListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Quality Inspection records.
 */
export function useQualityInspectionList(
  params: QualityInspectionListParams = {},
  options?: Omit<UseQueryOptions<QualityInspection[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.qualityInspection.list(params),
    queryFn: () => apiGet<QualityInspection[]>(`/quality-inspection${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Quality Inspection by ID.
 */
export function useQualityInspection(
  id: string | undefined,
  options?: Omit<UseQueryOptions<QualityInspection | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.qualityInspection.detail(id ?? ''),
    queryFn: () => apiGet<QualityInspection | null>(`/quality-inspection/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Quality Inspection.
 * Automatically invalidates list queries on success.
 */
export function useCreateQualityInspection(
  options?: UseMutationOptions<QualityInspection, Error, Partial<QualityInspection>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<QualityInspection>) => apiPost<QualityInspection>('/quality-inspection', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityInspection.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Quality Inspection.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateQualityInspection(
  options?: UseMutationOptions<QualityInspection, Error, { id: string; data: Partial<QualityInspection> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<QualityInspection> }) =>
      apiPut<QualityInspection>(`/quality-inspection/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityInspection.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityInspection.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Quality Inspection by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteQualityInspection(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/quality-inspection/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityInspection.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Quality Inspection (set docstatus = 1).
 */
export function useSubmitQualityInspection(
  options?: UseMutationOptions<QualityInspection, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<QualityInspection>(`/quality-inspection/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityInspection.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityInspection.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Quality Inspection (set docstatus = 2).
 */
export function useCancelQualityInspection(
  options?: UseMutationOptions<QualityInspection, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<QualityInspection>(`/quality-inspection/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityInspection.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityInspection.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
