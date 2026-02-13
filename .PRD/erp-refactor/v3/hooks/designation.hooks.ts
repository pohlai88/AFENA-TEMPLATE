// TanStack Query hooks for Designation
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Designation } from '../types/designation.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface DesignationListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Designation records.
 */
export function useDesignationList(
  params: DesignationListParams = {},
  options?: Omit<UseQueryOptions<Designation[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.designation.list(params),
    queryFn: () => apiGet<Designation[]>(`/designation${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Designation by ID.
 */
export function useDesignation(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Designation | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.designation.detail(id ?? ''),
    queryFn: () => apiGet<Designation | null>(`/designation/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Designation.
 * Automatically invalidates list queries on success.
 */
export function useCreateDesignation(
  options?: UseMutationOptions<Designation, Error, Partial<Designation>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Designation>) => apiPost<Designation>('/designation', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.designation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Designation.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateDesignation(
  options?: UseMutationOptions<Designation, Error, { id: string; data: Partial<Designation> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Designation> }) =>
      apiPut<Designation>(`/designation/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.designation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.designation.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Designation by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteDesignation(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/designation/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.designation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
