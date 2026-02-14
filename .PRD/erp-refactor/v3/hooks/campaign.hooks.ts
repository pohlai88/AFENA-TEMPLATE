// TanStack Query hooks for Campaign
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Campaign } from '../types/campaign.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface CampaignListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Campaign records.
 */
export function useCampaignList(
  params: CampaignListParams = {},
  options?: Omit<UseQueryOptions<Campaign[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.campaign.list(params),
    queryFn: () => apiGet<Campaign[]>(`/campaign${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Campaign by ID.
 */
export function useCampaign(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Campaign | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.campaign.detail(id ?? ''),
    queryFn: () => apiGet<Campaign | null>(`/campaign/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Campaign.
 * Automatically invalidates list queries on success.
 */
export function useCreateCampaign(
  options?: UseMutationOptions<Campaign, Error, Partial<Campaign>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Campaign>) => apiPost<Campaign>('/campaign', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaign.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Campaign.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateCampaign(
  options?: UseMutationOptions<Campaign, Error, { id: string; data: Partial<Campaign> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Campaign> }) =>
      apiPut<Campaign>(`/campaign/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaign.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.campaign.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Campaign by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteCampaign(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/campaign/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaign.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
