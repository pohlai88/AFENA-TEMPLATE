// TanStack Query hooks for Quality Procedure Process
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { QualityProcedureProcess } from '../types/quality-procedure-process.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface QualityProcedureProcessListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Quality Procedure Process records.
 */
export function useQualityProcedureProcessList(
  params: QualityProcedureProcessListParams = {},
  options?: Omit<UseQueryOptions<QualityProcedureProcess[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.qualityProcedureProcess.list(params),
    queryFn: () => apiGet<QualityProcedureProcess[]>(`/quality-procedure-process${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Quality Procedure Process by ID.
 */
export function useQualityProcedureProcess(
  id: string | undefined,
  options?: Omit<UseQueryOptions<QualityProcedureProcess | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.qualityProcedureProcess.detail(id ?? ''),
    queryFn: () => apiGet<QualityProcedureProcess | null>(`/quality-procedure-process/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Quality Procedure Process.
 * Automatically invalidates list queries on success.
 */
export function useCreateQualityProcedureProcess(
  options?: UseMutationOptions<QualityProcedureProcess, Error, Partial<QualityProcedureProcess>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<QualityProcedureProcess>) => apiPost<QualityProcedureProcess>('/quality-procedure-process', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityProcedureProcess.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Quality Procedure Process.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateQualityProcedureProcess(
  options?: UseMutationOptions<QualityProcedureProcess, Error, { id: string; data: Partial<QualityProcedureProcess> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<QualityProcedureProcess> }) =>
      apiPut<QualityProcedureProcess>(`/quality-procedure-process/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityProcedureProcess.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityProcedureProcess.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Quality Procedure Process by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteQualityProcedureProcess(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/quality-procedure-process/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityProcedureProcess.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
