// TanStack Query hooks for POS Opening Entry Detail
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PosOpeningEntryDetail } from '../types/pos-opening-entry-detail.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PosOpeningEntryDetailListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of POS Opening Entry Detail records.
 */
export function usePosOpeningEntryDetailList(
  params: PosOpeningEntryDetailListParams = {},
  options?: Omit<UseQueryOptions<PosOpeningEntryDetail[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.posOpeningEntryDetail.list(params),
    queryFn: () => apiGet<PosOpeningEntryDetail[]>(`/pos-opening-entry-detail${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single POS Opening Entry Detail by ID.
 */
export function usePosOpeningEntryDetail(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PosOpeningEntryDetail | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.posOpeningEntryDetail.detail(id ?? ''),
    queryFn: () => apiGet<PosOpeningEntryDetail | null>(`/pos-opening-entry-detail/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new POS Opening Entry Detail.
 * Automatically invalidates list queries on success.
 */
export function useCreatePosOpeningEntryDetail(
  options?: UseMutationOptions<PosOpeningEntryDetail, Error, Partial<PosOpeningEntryDetail>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PosOpeningEntryDetail>) => apiPost<PosOpeningEntryDetail>('/pos-opening-entry-detail', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posOpeningEntryDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing POS Opening Entry Detail.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePosOpeningEntryDetail(
  options?: UseMutationOptions<PosOpeningEntryDetail, Error, { id: string; data: Partial<PosOpeningEntryDetail> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PosOpeningEntryDetail> }) =>
      apiPut<PosOpeningEntryDetail>(`/pos-opening-entry-detail/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posOpeningEntryDetail.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posOpeningEntryDetail.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a POS Opening Entry Detail by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePosOpeningEntryDetail(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/pos-opening-entry-detail/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posOpeningEntryDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
