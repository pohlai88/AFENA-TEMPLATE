// TanStack Query hooks for Quality Feedback Template Parameter
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { QualityFeedbackTemplateParameter } from '../types/quality-feedback-template-parameter.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface QualityFeedbackTemplateParameterListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Quality Feedback Template Parameter records.
 */
export function useQualityFeedbackTemplateParameterList(
  params: QualityFeedbackTemplateParameterListParams = {},
  options?: Omit<UseQueryOptions<QualityFeedbackTemplateParameter[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.qualityFeedbackTemplateParameter.list(params),
    queryFn: () => apiGet<QualityFeedbackTemplateParameter[]>(`/quality-feedback-template-parameter${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Quality Feedback Template Parameter by ID.
 */
export function useQualityFeedbackTemplateParameter(
  id: string | undefined,
  options?: Omit<UseQueryOptions<QualityFeedbackTemplateParameter | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.qualityFeedbackTemplateParameter.detail(id ?? ''),
    queryFn: () => apiGet<QualityFeedbackTemplateParameter | null>(`/quality-feedback-template-parameter/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Quality Feedback Template Parameter.
 * Automatically invalidates list queries on success.
 */
export function useCreateQualityFeedbackTemplateParameter(
  options?: UseMutationOptions<QualityFeedbackTemplateParameter, Error, Partial<QualityFeedbackTemplateParameter>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<QualityFeedbackTemplateParameter>) => apiPost<QualityFeedbackTemplateParameter>('/quality-feedback-template-parameter', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityFeedbackTemplateParameter.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Quality Feedback Template Parameter.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateQualityFeedbackTemplateParameter(
  options?: UseMutationOptions<QualityFeedbackTemplateParameter, Error, { id: string; data: Partial<QualityFeedbackTemplateParameter> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<QualityFeedbackTemplateParameter> }) =>
      apiPut<QualityFeedbackTemplateParameter>(`/quality-feedback-template-parameter/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityFeedbackTemplateParameter.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityFeedbackTemplateParameter.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Quality Feedback Template Parameter by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteQualityFeedbackTemplateParameter(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/quality-feedback-template-parameter/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityFeedbackTemplateParameter.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
