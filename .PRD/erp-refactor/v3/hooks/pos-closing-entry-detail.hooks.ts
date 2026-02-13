// TanStack Query hooks for POS Closing Entry Detail
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PosClosingEntryDetail } from '../types/pos-closing-entry-detail.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PosClosingEntryDetailListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of POS Closing Entry Detail records.
 */
export function usePosClosingEntryDetailList(
  params: PosClosingEntryDetailListParams = {},
  options?: Omit<UseQueryOptions<PosClosingEntryDetail[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.posClosingEntryDetail.list(params),
    queryFn: () => apiGet<PosClosingEntryDetail[]>(`/pos-closing-entry-detail${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single POS Closing Entry Detail by ID.
 */
export function usePosClosingEntryDetail(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PosClosingEntryDetail | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.posClosingEntryDetail.detail(id ?? ''),
    queryFn: () => apiGet<PosClosingEntryDetail | null>(`/pos-closing-entry-detail/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new POS Closing Entry Detail.
 * Automatically invalidates list queries on success.
 */
export function useCreatePosClosingEntryDetail(
  options?: UseMutationOptions<PosClosingEntryDetail, Error, Partial<PosClosingEntryDetail>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PosClosingEntryDetail>) => apiPost<PosClosingEntryDetail>('/pos-closing-entry-detail', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posClosingEntryDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing POS Closing Entry Detail.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePosClosingEntryDetail(
  options?: UseMutationOptions<PosClosingEntryDetail, Error, { id: string; data: Partial<PosClosingEntryDetail> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PosClosingEntryDetail> }) =>
      apiPut<PosClosingEntryDetail>(`/pos-closing-entry-detail/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posClosingEntryDetail.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posClosingEntryDetail.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a POS Closing Entry Detail by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePosClosingEntryDetail(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/pos-closing-entry-detail/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posClosingEntryDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
