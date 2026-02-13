// TanStack Query hooks for Serial No
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SerialNo } from '../types/serial-no.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SerialNoListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Serial No records.
 */
export function useSerialNoList(
  params: SerialNoListParams = {},
  options?: Omit<UseQueryOptions<SerialNo[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.serialNo.list(params),
    queryFn: () => apiGet<SerialNo[]>(`/serial-no${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Serial No by ID.
 */
export function useSerialNo(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SerialNo | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.serialNo.detail(id ?? ''),
    queryFn: () => apiGet<SerialNo | null>(`/serial-no/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Serial No.
 * Automatically invalidates list queries on success.
 */
export function useCreateSerialNo(
  options?: UseMutationOptions<SerialNo, Error, Partial<SerialNo>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SerialNo>) => apiPost<SerialNo>('/serial-no', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serialNo.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Serial No.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSerialNo(
  options?: UseMutationOptions<SerialNo, Error, { id: string; data: Partial<SerialNo> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SerialNo> }) =>
      apiPut<SerialNo>(`/serial-no/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serialNo.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.serialNo.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Serial No by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSerialNo(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/serial-no/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serialNo.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
