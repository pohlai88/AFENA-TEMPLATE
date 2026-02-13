// TanStack Query hooks for Email Digest
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { EmailDigest } from '../types/email-digest.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface EmailDigestListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Email Digest records.
 */
export function useEmailDigestList(
  params: EmailDigestListParams = {},
  options?: Omit<UseQueryOptions<EmailDigest[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.emailDigest.list(params),
    queryFn: () => apiGet<EmailDigest[]>(`/email-digest${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Email Digest by ID.
 */
export function useEmailDigest(
  id: string | undefined,
  options?: Omit<UseQueryOptions<EmailDigest | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.emailDigest.detail(id ?? ''),
    queryFn: () => apiGet<EmailDigest | null>(`/email-digest/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Email Digest.
 * Automatically invalidates list queries on success.
 */
export function useCreateEmailDigest(
  options?: UseMutationOptions<EmailDigest, Error, Partial<EmailDigest>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<EmailDigest>) => apiPost<EmailDigest>('/email-digest', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.emailDigest.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Email Digest.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateEmailDigest(
  options?: UseMutationOptions<EmailDigest, Error, { id: string; data: Partial<EmailDigest> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EmailDigest> }) =>
      apiPut<EmailDigest>(`/email-digest/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.emailDigest.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.emailDigest.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Email Digest by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteEmailDigest(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/email-digest/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.emailDigest.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
