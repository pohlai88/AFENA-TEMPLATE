// TanStack Query hooks for Quality Inspection Reading
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { QualityInspectionReading } from '../types/quality-inspection-reading.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface QualityInspectionReadingListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Quality Inspection Reading records.
 */
export function useQualityInspectionReadingList(
  params: QualityInspectionReadingListParams = {},
  options?: Omit<UseQueryOptions<QualityInspectionReading[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.qualityInspectionReading.list(params),
    queryFn: () => apiGet<QualityInspectionReading[]>(`/quality-inspection-reading${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Quality Inspection Reading by ID.
 */
export function useQualityInspectionReading(
  id: string | undefined,
  options?: Omit<UseQueryOptions<QualityInspectionReading | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.qualityInspectionReading.detail(id ?? ''),
    queryFn: () => apiGet<QualityInspectionReading | null>(`/quality-inspection-reading/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Quality Inspection Reading.
 * Automatically invalidates list queries on success.
 */
export function useCreateQualityInspectionReading(
  options?: UseMutationOptions<QualityInspectionReading, Error, Partial<QualityInspectionReading>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<QualityInspectionReading>) => apiPost<QualityInspectionReading>('/quality-inspection-reading', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityInspectionReading.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Quality Inspection Reading.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateQualityInspectionReading(
  options?: UseMutationOptions<QualityInspectionReading, Error, { id: string; data: Partial<QualityInspectionReading> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<QualityInspectionReading> }) =>
      apiPut<QualityInspectionReading>(`/quality-inspection-reading/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityInspectionReading.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityInspectionReading.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Quality Inspection Reading by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteQualityInspectionReading(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/quality-inspection-reading/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityInspectionReading.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
