// TanStack Query hooks for Journal Entry Account
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { JournalEntryAccount } from '../types/journal-entry-account.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface JournalEntryAccountListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Journal Entry Account records.
 */
export function useJournalEntryAccountList(
  params: JournalEntryAccountListParams = {},
  options?: Omit<UseQueryOptions<JournalEntryAccount[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.journalEntryAccount.list(params),
    queryFn: () => apiGet<JournalEntryAccount[]>(`/journal-entry-account${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Journal Entry Account by ID.
 */
export function useJournalEntryAccount(
  id: string | undefined,
  options?: Omit<UseQueryOptions<JournalEntryAccount | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.journalEntryAccount.detail(id ?? ''),
    queryFn: () => apiGet<JournalEntryAccount | null>(`/journal-entry-account/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Journal Entry Account.
 * Automatically invalidates list queries on success.
 */
export function useCreateJournalEntryAccount(
  options?: UseMutationOptions<JournalEntryAccount, Error, Partial<JournalEntryAccount>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<JournalEntryAccount>) => apiPost<JournalEntryAccount>('/journal-entry-account', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.journalEntryAccount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Journal Entry Account.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateJournalEntryAccount(
  options?: UseMutationOptions<JournalEntryAccount, Error, { id: string; data: Partial<JournalEntryAccount> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<JournalEntryAccount> }) =>
      apiPut<JournalEntryAccount>(`/journal-entry-account/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.journalEntryAccount.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.journalEntryAccount.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Journal Entry Account by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteJournalEntryAccount(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/journal-entry-account/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.journalEntryAccount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
