// TanStack Query hooks for POS Closing Entry
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PosClosingEntry } from '../types/pos-closing-entry.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PosClosingEntryListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of POS Closing Entry records.
 */
export function usePosClosingEntryList(
  params: PosClosingEntryListParams = {},
  options?: Omit<UseQueryOptions<PosClosingEntry[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.posClosingEntry.list(params),
    queryFn: () => apiGet<PosClosingEntry[]>(`/pos-closing-entry${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single POS Closing Entry by ID.
 */
export function usePosClosingEntry(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PosClosingEntry | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.posClosingEntry.detail(id ?? ''),
    queryFn: () => apiGet<PosClosingEntry | null>(`/pos-closing-entry/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new POS Closing Entry.
 * Automatically invalidates list queries on success.
 */
export function useCreatePosClosingEntry(
  options?: UseMutationOptions<PosClosingEntry, Error, Partial<PosClosingEntry>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PosClosingEntry>) => apiPost<PosClosingEntry>('/pos-closing-entry', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posClosingEntry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing POS Closing Entry.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePosClosingEntry(
  options?: UseMutationOptions<PosClosingEntry, Error, { id: string; data: Partial<PosClosingEntry> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PosClosingEntry> }) =>
      apiPut<PosClosingEntry>(`/pos-closing-entry/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posClosingEntry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posClosingEntry.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a POS Closing Entry by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePosClosingEntry(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/pos-closing-entry/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posClosingEntry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a POS Closing Entry (set docstatus = 1).
 */
export function useSubmitPosClosingEntry(
  options?: UseMutationOptions<PosClosingEntry, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<PosClosingEntry>(`/pos-closing-entry/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posClosingEntry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posClosingEntry.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a POS Closing Entry (set docstatus = 2).
 */
export function useCancelPosClosingEntry(
  options?: UseMutationOptions<PosClosingEntry, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<PosClosingEntry>(`/pos-closing-entry/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posClosingEntry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posClosingEntry.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
