// TanStack Query hooks for Quality Inspection Parameter Group
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { QualityInspectionParameterGroup } from '../types/quality-inspection-parameter-group.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface QualityInspectionParameterGroupListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Quality Inspection Parameter Group records.
 */
export function useQualityInspectionParameterGroupList(
  params: QualityInspectionParameterGroupListParams = {},
  options?: Omit<UseQueryOptions<QualityInspectionParameterGroup[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.qualityInspectionParameterGroup.list(params),
    queryFn: () => apiGet<QualityInspectionParameterGroup[]>(`/quality-inspection-parameter-group${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Quality Inspection Parameter Group by ID.
 */
export function useQualityInspectionParameterGroup(
  id: string | undefined,
  options?: Omit<UseQueryOptions<QualityInspectionParameterGroup | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.qualityInspectionParameterGroup.detail(id ?? ''),
    queryFn: () => apiGet<QualityInspectionParameterGroup | null>(`/quality-inspection-parameter-group/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Quality Inspection Parameter Group.
 * Automatically invalidates list queries on success.
 */
export function useCreateQualityInspectionParameterGroup(
  options?: UseMutationOptions<QualityInspectionParameterGroup, Error, Partial<QualityInspectionParameterGroup>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<QualityInspectionParameterGroup>) => apiPost<QualityInspectionParameterGroup>('/quality-inspection-parameter-group', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityInspectionParameterGroup.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Quality Inspection Parameter Group.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateQualityInspectionParameterGroup(
  options?: UseMutationOptions<QualityInspectionParameterGroup, Error, { id: string; data: Partial<QualityInspectionParameterGroup> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<QualityInspectionParameterGroup> }) =>
      apiPut<QualityInspectionParameterGroup>(`/quality-inspection-parameter-group/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityInspectionParameterGroup.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityInspectionParameterGroup.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Quality Inspection Parameter Group by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteQualityInspectionParameterGroup(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/quality-inspection-parameter-group/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityInspectionParameterGroup.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
