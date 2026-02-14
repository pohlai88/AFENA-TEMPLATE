// TanStack Query hooks for Quality Procedure
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { QualityProcedure } from '../types/quality-procedure.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface QualityProcedureListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Quality Procedure records.
 */
export function useQualityProcedureList(
  params: QualityProcedureListParams = {},
  options?: Omit<UseQueryOptions<QualityProcedure[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.qualityProcedure.list(params),
    queryFn: () => apiGet<QualityProcedure[]>(`/quality-procedure${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Quality Procedure by ID.
 */
export function useQualityProcedure(
  id: string | undefined,
  options?: Omit<UseQueryOptions<QualityProcedure | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.qualityProcedure.detail(id ?? ''),
    queryFn: () => apiGet<QualityProcedure | null>(`/quality-procedure/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Quality Procedure.
 * Automatically invalidates list queries on success.
 */
export function useCreateQualityProcedure(
  options?: UseMutationOptions<QualityProcedure, Error, Partial<QualityProcedure>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<QualityProcedure>) => apiPost<QualityProcedure>('/quality-procedure', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityProcedure.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Quality Procedure.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateQualityProcedure(
  options?: UseMutationOptions<QualityProcedure, Error, { id: string; data: Partial<QualityProcedure> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<QualityProcedure> }) =>
      apiPut<QualityProcedure>(`/quality-procedure/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityProcedure.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityProcedure.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Quality Procedure by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteQualityProcedure(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/quality-procedure/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityProcedure.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
