// TanStack Query hooks for Quality Feedback Template
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { QualityFeedbackTemplate } from '../types/quality-feedback-template.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface QualityFeedbackTemplateListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Quality Feedback Template records.
 */
export function useQualityFeedbackTemplateList(
  params: QualityFeedbackTemplateListParams = {},
  options?: Omit<UseQueryOptions<QualityFeedbackTemplate[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.qualityFeedbackTemplate.list(params),
    queryFn: () => apiGet<QualityFeedbackTemplate[]>(`/quality-feedback-template${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Quality Feedback Template by ID.
 */
export function useQualityFeedbackTemplate(
  id: string | undefined,
  options?: Omit<UseQueryOptions<QualityFeedbackTemplate | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.qualityFeedbackTemplate.detail(id ?? ''),
    queryFn: () => apiGet<QualityFeedbackTemplate | null>(`/quality-feedback-template/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Quality Feedback Template.
 * Automatically invalidates list queries on success.
 */
export function useCreateQualityFeedbackTemplate(
  options?: UseMutationOptions<QualityFeedbackTemplate, Error, Partial<QualityFeedbackTemplate>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<QualityFeedbackTemplate>) => apiPost<QualityFeedbackTemplate>('/quality-feedback-template', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityFeedbackTemplate.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Quality Feedback Template.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateQualityFeedbackTemplate(
  options?: UseMutationOptions<QualityFeedbackTemplate, Error, { id: string; data: Partial<QualityFeedbackTemplate> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<QualityFeedbackTemplate> }) =>
      apiPut<QualityFeedbackTemplate>(`/quality-feedback-template/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityFeedbackTemplate.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityFeedbackTemplate.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Quality Feedback Template by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteQualityFeedbackTemplate(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/quality-feedback-template/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityFeedbackTemplate.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
