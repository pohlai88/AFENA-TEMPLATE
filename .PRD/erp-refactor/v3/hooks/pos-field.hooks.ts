// TanStack Query hooks for POS Field
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PosField } from '../types/pos-field.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PosFieldListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of POS Field records.
 */
export function usePosFieldList(
  params: PosFieldListParams = {},
  options?: Omit<UseQueryOptions<PosField[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.posField.list(params),
    queryFn: () => apiGet<PosField[]>(`/pos-field${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single POS Field by ID.
 */
export function usePosField(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PosField | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.posField.detail(id ?? ''),
    queryFn: () => apiGet<PosField | null>(`/pos-field/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new POS Field.
 * Automatically invalidates list queries on success.
 */
export function useCreatePosField(
  options?: UseMutationOptions<PosField, Error, Partial<PosField>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PosField>) => apiPost<PosField>('/pos-field', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posField.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing POS Field.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePosField(
  options?: UseMutationOptions<PosField, Error, { id: string; data: Partial<PosField> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PosField> }) =>
      apiPut<PosField>(`/pos-field/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posField.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posField.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a POS Field by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePosField(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/pos-field/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posField.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
