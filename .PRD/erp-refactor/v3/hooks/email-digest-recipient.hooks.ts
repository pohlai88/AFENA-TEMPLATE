// TanStack Query hooks for Email Digest Recipient
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { EmailDigestRecipient } from '../types/email-digest-recipient.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface EmailDigestRecipientListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Email Digest Recipient records.
 */
export function useEmailDigestRecipientList(
  params: EmailDigestRecipientListParams = {},
  options?: Omit<UseQueryOptions<EmailDigestRecipient[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.emailDigestRecipient.list(params),
    queryFn: () => apiGet<EmailDigestRecipient[]>(`/email-digest-recipient${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Email Digest Recipient by ID.
 */
export function useEmailDigestRecipient(
  id: string | undefined,
  options?: Omit<UseQueryOptions<EmailDigestRecipient | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.emailDigestRecipient.detail(id ?? ''),
    queryFn: () => apiGet<EmailDigestRecipient | null>(`/email-digest-recipient/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Email Digest Recipient.
 * Automatically invalidates list queries on success.
 */
export function useCreateEmailDigestRecipient(
  options?: UseMutationOptions<EmailDigestRecipient, Error, Partial<EmailDigestRecipient>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<EmailDigestRecipient>) => apiPost<EmailDigestRecipient>('/email-digest-recipient', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.emailDigestRecipient.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Email Digest Recipient.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateEmailDigestRecipient(
  options?: UseMutationOptions<EmailDigestRecipient, Error, { id: string; data: Partial<EmailDigestRecipient> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EmailDigestRecipient> }) =>
      apiPut<EmailDigestRecipient>(`/email-digest-recipient/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.emailDigestRecipient.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.emailDigestRecipient.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Email Digest Recipient by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteEmailDigestRecipient(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/email-digest-recipient/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.emailDigestRecipient.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
