// TanStack Query hooks for POS Opening Entry
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PosOpeningEntry } from '../types/pos-opening-entry.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PosOpeningEntryListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of POS Opening Entry records.
 */
export function usePosOpeningEntryList(
  params: PosOpeningEntryListParams = {},
  options?: Omit<UseQueryOptions<PosOpeningEntry[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.posOpeningEntry.list(params),
    queryFn: () => apiGet<PosOpeningEntry[]>(`/pos-opening-entry${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single POS Opening Entry by ID.
 */
export function usePosOpeningEntry(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PosOpeningEntry | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.posOpeningEntry.detail(id ?? ''),
    queryFn: () => apiGet<PosOpeningEntry | null>(`/pos-opening-entry/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new POS Opening Entry.
 * Automatically invalidates list queries on success.
 */
export function useCreatePosOpeningEntry(
  options?: UseMutationOptions<PosOpeningEntry, Error, Partial<PosOpeningEntry>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PosOpeningEntry>) => apiPost<PosOpeningEntry>('/pos-opening-entry', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posOpeningEntry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing POS Opening Entry.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePosOpeningEntry(
  options?: UseMutationOptions<PosOpeningEntry, Error, { id: string; data: Partial<PosOpeningEntry> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PosOpeningEntry> }) =>
      apiPut<PosOpeningEntry>(`/pos-opening-entry/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posOpeningEntry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posOpeningEntry.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a POS Opening Entry by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePosOpeningEntry(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/pos-opening-entry/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posOpeningEntry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a POS Opening Entry (set docstatus = 1).
 */
export function useSubmitPosOpeningEntry(
  options?: UseMutationOptions<PosOpeningEntry, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<PosOpeningEntry>(`/pos-opening-entry/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posOpeningEntry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posOpeningEntry.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a POS Opening Entry (set docstatus = 2).
 */
export function useCancelPosOpeningEntry(
  options?: UseMutationOptions<PosOpeningEntry, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<PosOpeningEntry>(`/pos-opening-entry/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posOpeningEntry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posOpeningEntry.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
