// TanStack Query hooks for Journal Entry Template
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { JournalEntryTemplate } from '../types/journal-entry-template.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface JournalEntryTemplateListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Journal Entry Template records.
 */
export function useJournalEntryTemplateList(
  params: JournalEntryTemplateListParams = {},
  options?: Omit<UseQueryOptions<JournalEntryTemplate[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.journalEntryTemplate.list(params),
    queryFn: () => apiGet<JournalEntryTemplate[]>(`/journal-entry-template${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Journal Entry Template by ID.
 */
export function useJournalEntryTemplate(
  id: string | undefined,
  options?: Omit<UseQueryOptions<JournalEntryTemplate | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.journalEntryTemplate.detail(id ?? ''),
    queryFn: () => apiGet<JournalEntryTemplate | null>(`/journal-entry-template/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Journal Entry Template.
 * Automatically invalidates list queries on success.
 */
export function useCreateJournalEntryTemplate(
  options?: UseMutationOptions<JournalEntryTemplate, Error, Partial<JournalEntryTemplate>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<JournalEntryTemplate>) => apiPost<JournalEntryTemplate>('/journal-entry-template', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.journalEntryTemplate.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Journal Entry Template.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateJournalEntryTemplate(
  options?: UseMutationOptions<JournalEntryTemplate, Error, { id: string; data: Partial<JournalEntryTemplate> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<JournalEntryTemplate> }) =>
      apiPut<JournalEntryTemplate>(`/journal-entry-template/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.journalEntryTemplate.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.journalEntryTemplate.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Journal Entry Template by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteJournalEntryTemplate(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/journal-entry-template/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.journalEntryTemplate.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
