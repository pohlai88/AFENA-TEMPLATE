// TanStack Query hooks for Campaign Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { CampaignItem } from '../types/campaign-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface CampaignItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Campaign Item records.
 */
export function useCampaignItemList(
  params: CampaignItemListParams = {},
  options?: Omit<UseQueryOptions<CampaignItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.campaignItem.list(params),
    queryFn: () => apiGet<CampaignItem[]>(`/campaign-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Campaign Item by ID.
 */
export function useCampaignItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<CampaignItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.campaignItem.detail(id ?? ''),
    queryFn: () => apiGet<CampaignItem | null>(`/campaign-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Campaign Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateCampaignItem(
  options?: UseMutationOptions<CampaignItem, Error, Partial<CampaignItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CampaignItem>) => apiPost<CampaignItem>('/campaign-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaignItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Campaign Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateCampaignItem(
  options?: UseMutationOptions<CampaignItem, Error, { id: string; data: Partial<CampaignItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CampaignItem> }) =>
      apiPut<CampaignItem>(`/campaign-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaignItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.campaignItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Campaign Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteCampaignItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/campaign-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaignItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
