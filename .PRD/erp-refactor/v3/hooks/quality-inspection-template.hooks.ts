// TanStack Query hooks for Quality Inspection Template
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { QualityInspectionTemplate } from '../types/quality-inspection-template.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface QualityInspectionTemplateListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Quality Inspection Template records.
 */
export function useQualityInspectionTemplateList(
  params: QualityInspectionTemplateListParams = {},
  options?: Omit<UseQueryOptions<QualityInspectionTemplate[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.qualityInspectionTemplate.list(params),
    queryFn: () => apiGet<QualityInspectionTemplate[]>(`/quality-inspection-template${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Quality Inspection Template by ID.
 */
export function useQualityInspectionTemplate(
  id: string | undefined,
  options?: Omit<UseQueryOptions<QualityInspectionTemplate | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.qualityInspectionTemplate.detail(id ?? ''),
    queryFn: () => apiGet<QualityInspectionTemplate | null>(`/quality-inspection-template/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Quality Inspection Template.
 * Automatically invalidates list queries on success.
 */
export function useCreateQualityInspectionTemplate(
  options?: UseMutationOptions<QualityInspectionTemplate, Error, Partial<QualityInspectionTemplate>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<QualityInspectionTemplate>) => apiPost<QualityInspectionTemplate>('/quality-inspection-template', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityInspectionTemplate.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Quality Inspection Template.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateQualityInspectionTemplate(
  options?: UseMutationOptions<QualityInspectionTemplate, Error, { id: string; data: Partial<QualityInspectionTemplate> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<QualityInspectionTemplate> }) =>
      apiPut<QualityInspectionTemplate>(`/quality-inspection-template/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityInspectionTemplate.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityInspectionTemplate.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Quality Inspection Template by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteQualityInspectionTemplate(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/quality-inspection-template/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityInspectionTemplate.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
