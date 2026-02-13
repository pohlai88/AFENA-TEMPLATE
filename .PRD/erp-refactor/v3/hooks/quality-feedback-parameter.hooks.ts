// TanStack Query hooks for Quality Feedback Parameter
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { QualityFeedbackParameter } from '../types/quality-feedback-parameter.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface QualityFeedbackParameterListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Quality Feedback Parameter records.
 */
export function useQualityFeedbackParameterList(
  params: QualityFeedbackParameterListParams = {},
  options?: Omit<UseQueryOptions<QualityFeedbackParameter[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.qualityFeedbackParameter.list(params),
    queryFn: () => apiGet<QualityFeedbackParameter[]>(`/quality-feedback-parameter${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Quality Feedback Parameter by ID.
 */
export function useQualityFeedbackParameter(
  id: string | undefined,
  options?: Omit<UseQueryOptions<QualityFeedbackParameter | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.qualityFeedbackParameter.detail(id ?? ''),
    queryFn: () => apiGet<QualityFeedbackParameter | null>(`/quality-feedback-parameter/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Quality Feedback Parameter.
 * Automatically invalidates list queries on success.
 */
export function useCreateQualityFeedbackParameter(
  options?: UseMutationOptions<QualityFeedbackParameter, Error, Partial<QualityFeedbackParameter>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<QualityFeedbackParameter>) => apiPost<QualityFeedbackParameter>('/quality-feedback-parameter', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityFeedbackParameter.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Quality Feedback Parameter.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateQualityFeedbackParameter(
  options?: UseMutationOptions<QualityFeedbackParameter, Error, { id: string; data: Partial<QualityFeedbackParameter> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<QualityFeedbackParameter> }) =>
      apiPut<QualityFeedbackParameter>(`/quality-feedback-parameter/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityFeedbackParameter.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityFeedbackParameter.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Quality Feedback Parameter by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteQualityFeedbackParameter(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/quality-feedback-parameter/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityFeedbackParameter.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
