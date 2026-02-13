// TanStack Query hooks for CRM Note
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { CrmNote } from '../types/crm-note.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface CrmNoteListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of CRM Note records.
 */
export function useCrmNoteList(
  params: CrmNoteListParams = {},
  options?: Omit<UseQueryOptions<CrmNote[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.crmNote.list(params),
    queryFn: () => apiGet<CrmNote[]>(`/crm-note${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single CRM Note by ID.
 */
export function useCrmNote(
  id: string | undefined,
  options?: Omit<UseQueryOptions<CrmNote | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.crmNote.detail(id ?? ''),
    queryFn: () => apiGet<CrmNote | null>(`/crm-note/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new CRM Note.
 * Automatically invalidates list queries on success.
 */
export function useCreateCrmNote(
  options?: UseMutationOptions<CrmNote, Error, Partial<CrmNote>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CrmNote>) => apiPost<CrmNote>('/crm-note', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.crmNote.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing CRM Note.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateCrmNote(
  options?: UseMutationOptions<CrmNote, Error, { id: string; data: Partial<CrmNote> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CrmNote> }) =>
      apiPut<CrmNote>(`/crm-note/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.crmNote.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.crmNote.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a CRM Note by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteCrmNote(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/crm-note/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.crmNote.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
