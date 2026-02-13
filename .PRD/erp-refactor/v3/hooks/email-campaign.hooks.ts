// TanStack Query hooks for Email Campaign
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { EmailCampaign } from '../types/email-campaign.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface EmailCampaignListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Email Campaign records.
 */
export function useEmailCampaignList(
  params: EmailCampaignListParams = {},
  options?: Omit<UseQueryOptions<EmailCampaign[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.emailCampaign.list(params),
    queryFn: () => apiGet<EmailCampaign[]>(`/email-campaign${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Email Campaign by ID.
 */
export function useEmailCampaign(
  id: string | undefined,
  options?: Omit<UseQueryOptions<EmailCampaign | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.emailCampaign.detail(id ?? ''),
    queryFn: () => apiGet<EmailCampaign | null>(`/email-campaign/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Email Campaign.
 * Automatically invalidates list queries on success.
 */
export function useCreateEmailCampaign(
  options?: UseMutationOptions<EmailCampaign, Error, Partial<EmailCampaign>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<EmailCampaign>) => apiPost<EmailCampaign>('/email-campaign', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.emailCampaign.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Email Campaign.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateEmailCampaign(
  options?: UseMutationOptions<EmailCampaign, Error, { id: string; data: Partial<EmailCampaign> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EmailCampaign> }) =>
      apiPut<EmailCampaign>(`/email-campaign/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.emailCampaign.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.emailCampaign.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Email Campaign by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteEmailCampaign(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/email-campaign/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.emailCampaign.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
