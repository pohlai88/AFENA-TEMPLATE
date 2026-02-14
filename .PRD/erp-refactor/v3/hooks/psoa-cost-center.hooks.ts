// TanStack Query hooks for PSOA Cost Center
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PsoaCostCenter } from '../types/psoa-cost-center.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PsoaCostCenterListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of PSOA Cost Center records.
 */
export function usePsoaCostCenterList(
  params: PsoaCostCenterListParams = {},
  options?: Omit<UseQueryOptions<PsoaCostCenter[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.psoaCostCenter.list(params),
    queryFn: () => apiGet<PsoaCostCenter[]>(`/psoa-cost-center${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single PSOA Cost Center by ID.
 */
export function usePsoaCostCenter(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PsoaCostCenter | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.psoaCostCenter.detail(id ?? ''),
    queryFn: () => apiGet<PsoaCostCenter | null>(`/psoa-cost-center/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new PSOA Cost Center.
 * Automatically invalidates list queries on success.
 */
export function useCreatePsoaCostCenter(
  options?: UseMutationOptions<PsoaCostCenter, Error, Partial<PsoaCostCenter>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PsoaCostCenter>) => apiPost<PsoaCostCenter>('/psoa-cost-center', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.psoaCostCenter.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing PSOA Cost Center.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePsoaCostCenter(
  options?: UseMutationOptions<PsoaCostCenter, Error, { id: string; data: Partial<PsoaCostCenter> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PsoaCostCenter> }) =>
      apiPut<PsoaCostCenter>(`/psoa-cost-center/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.psoaCostCenter.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.psoaCostCenter.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a PSOA Cost Center by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePsoaCostCenter(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/psoa-cost-center/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.psoaCostCenter.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
