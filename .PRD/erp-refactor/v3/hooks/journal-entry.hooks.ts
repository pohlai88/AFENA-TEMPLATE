// TanStack Query hooks for Journal Entry
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { JournalEntry } from '../types/journal-entry.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface JournalEntryListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Journal Entry records.
 */
export function useJournalEntryList(
  params: JournalEntryListParams = {},
  options?: Omit<UseQueryOptions<JournalEntry[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.journalEntry.list(params),
    queryFn: () => apiGet<JournalEntry[]>(`/journal-entry${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Journal Entry by ID.
 */
export function useJournalEntry(
  id: string | undefined,
  options?: Omit<UseQueryOptions<JournalEntry | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.journalEntry.detail(id ?? ''),
    queryFn: () => apiGet<JournalEntry | null>(`/journal-entry/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Journal Entry.
 * Automatically invalidates list queries on success.
 */
export function useCreateJournalEntry(
  options?: UseMutationOptions<JournalEntry, Error, Partial<JournalEntry>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<JournalEntry>) => apiPost<JournalEntry>('/journal-entry', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.journalEntry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Journal Entry.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateJournalEntry(
  options?: UseMutationOptions<JournalEntry, Error, { id: string; data: Partial<JournalEntry> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<JournalEntry> }) =>
      apiPut<JournalEntry>(`/journal-entry/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.journalEntry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.journalEntry.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Journal Entry by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteJournalEntry(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/journal-entry/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.journalEntry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Journal Entry (set docstatus = 1).
 */
export function useSubmitJournalEntry(
  options?: UseMutationOptions<JournalEntry, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<JournalEntry>(`/journal-entry/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.journalEntry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.journalEntry.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Journal Entry (set docstatus = 2).
 */
export function useCancelJournalEntry(
  options?: UseMutationOptions<JournalEntry, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<JournalEntry>(`/journal-entry/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.journalEntry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.journalEntry.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
