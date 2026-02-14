// TanStack Query hooks for POS Search Fields
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PosSearchFields } from '../types/pos-search-fields.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PosSearchFieldsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of POS Search Fields records.
 */
export function usePosSearchFieldsList(
  params: PosSearchFieldsListParams = {},
  options?: Omit<UseQueryOptions<PosSearchFields[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.posSearchFields.list(params),
    queryFn: () => apiGet<PosSearchFields[]>(`/pos-search-fields${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single POS Search Fields by ID.
 */
export function usePosSearchFields(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PosSearchFields | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.posSearchFields.detail(id ?? ''),
    queryFn: () => apiGet<PosSearchFields | null>(`/pos-search-fields/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new POS Search Fields.
 * Automatically invalidates list queries on success.
 */
export function useCreatePosSearchFields(
  options?: UseMutationOptions<PosSearchFields, Error, Partial<PosSearchFields>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PosSearchFields>) => apiPost<PosSearchFields>('/pos-search-fields', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posSearchFields.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing POS Search Fields.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePosSearchFields(
  options?: UseMutationOptions<PosSearchFields, Error, { id: string; data: Partial<PosSearchFields> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PosSearchFields> }) =>
      apiPut<PosSearchFields>(`/pos-search-fields/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posSearchFields.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posSearchFields.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a POS Search Fields by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePosSearchFields(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/pos-search-fields/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posSearchFields.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
