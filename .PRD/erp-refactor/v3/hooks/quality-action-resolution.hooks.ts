// TanStack Query hooks for Quality Action Resolution
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { QualityActionResolution } from '../types/quality-action-resolution.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface QualityActionResolutionListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Quality Action Resolution records.
 */
export function useQualityActionResolutionList(
  params: QualityActionResolutionListParams = {},
  options?: Omit<UseQueryOptions<QualityActionResolution[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.qualityActionResolution.list(params),
    queryFn: () => apiGet<QualityActionResolution[]>(`/quality-action-resolution${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Quality Action Resolution by ID.
 */
export function useQualityActionResolution(
  id: string | undefined,
  options?: Omit<UseQueryOptions<QualityActionResolution | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.qualityActionResolution.detail(id ?? ''),
    queryFn: () => apiGet<QualityActionResolution | null>(`/quality-action-resolution/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Quality Action Resolution.
 * Automatically invalidates list queries on success.
 */
export function useCreateQualityActionResolution(
  options?: UseMutationOptions<QualityActionResolution, Error, Partial<QualityActionResolution>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<QualityActionResolution>) => apiPost<QualityActionResolution>('/quality-action-resolution', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityActionResolution.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Quality Action Resolution.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateQualityActionResolution(
  options?: UseMutationOptions<QualityActionResolution, Error, { id: string; data: Partial<QualityActionResolution> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<QualityActionResolution> }) =>
      apiPut<QualityActionResolution>(`/quality-action-resolution/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityActionResolution.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityActionResolution.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Quality Action Resolution by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteQualityActionResolution(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/quality-action-resolution/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityActionResolution.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
