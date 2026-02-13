// TanStack Query hooks for Journal Entry Template Account
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { JournalEntryTemplateAccount } from '../types/journal-entry-template-account.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface JournalEntryTemplateAccountListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Journal Entry Template Account records.
 */
export function useJournalEntryTemplateAccountList(
  params: JournalEntryTemplateAccountListParams = {},
  options?: Omit<UseQueryOptions<JournalEntryTemplateAccount[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.journalEntryTemplateAccount.list(params),
    queryFn: () => apiGet<JournalEntryTemplateAccount[]>(`/journal-entry-template-account${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Journal Entry Template Account by ID.
 */
export function useJournalEntryTemplateAccount(
  id: string | undefined,
  options?: Omit<UseQueryOptions<JournalEntryTemplateAccount | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.journalEntryTemplateAccount.detail(id ?? ''),
    queryFn: () => apiGet<JournalEntryTemplateAccount | null>(`/journal-entry-template-account/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Journal Entry Template Account.
 * Automatically invalidates list queries on success.
 */
export function useCreateJournalEntryTemplateAccount(
  options?: UseMutationOptions<JournalEntryTemplateAccount, Error, Partial<JournalEntryTemplateAccount>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<JournalEntryTemplateAccount>) => apiPost<JournalEntryTemplateAccount>('/journal-entry-template-account', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.journalEntryTemplateAccount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Journal Entry Template Account.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateJournalEntryTemplateAccount(
  options?: UseMutationOptions<JournalEntryTemplateAccount, Error, { id: string; data: Partial<JournalEntryTemplateAccount> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<JournalEntryTemplateAccount> }) =>
      apiPut<JournalEntryTemplateAccount>(`/journal-entry-template-account/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.journalEntryTemplateAccount.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.journalEntryTemplateAccount.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Journal Entry Template Account by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteJournalEntryTemplateAccount(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/journal-entry-template-account/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.journalEntryTemplateAccount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
