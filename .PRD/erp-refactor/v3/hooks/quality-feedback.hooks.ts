// TanStack Query hooks for Quality Feedback
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { QualityFeedback } from '../types/quality-feedback.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface QualityFeedbackListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Quality Feedback records.
 */
export function useQualityFeedbackList(
  params: QualityFeedbackListParams = {},
  options?: Omit<UseQueryOptions<QualityFeedback[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.qualityFeedback.list(params),
    queryFn: () => apiGet<QualityFeedback[]>(`/quality-feedback${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Quality Feedback by ID.
 */
export function useQualityFeedback(
  id: string | undefined,
  options?: Omit<UseQueryOptions<QualityFeedback | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.qualityFeedback.detail(id ?? ''),
    queryFn: () => apiGet<QualityFeedback | null>(`/quality-feedback/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Quality Feedback.
 * Automatically invalidates list queries on success.
 */
export function useCreateQualityFeedback(
  options?: UseMutationOptions<QualityFeedback, Error, Partial<QualityFeedback>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<QualityFeedback>) => apiPost<QualityFeedback>('/quality-feedback', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityFeedback.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Quality Feedback.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateQualityFeedback(
  options?: UseMutationOptions<QualityFeedback, Error, { id: string; data: Partial<QualityFeedback> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<QualityFeedback> }) =>
      apiPut<QualityFeedback>(`/quality-feedback/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityFeedback.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityFeedback.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Quality Feedback by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteQualityFeedback(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/quality-feedback/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityFeedback.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
