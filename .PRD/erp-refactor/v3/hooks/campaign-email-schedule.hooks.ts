// TanStack Query hooks for Campaign Email Schedule
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { CampaignEmailSchedule } from '../types/campaign-email-schedule.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface CampaignEmailScheduleListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Campaign Email Schedule records.
 */
export function useCampaignEmailScheduleList(
  params: CampaignEmailScheduleListParams = {},
  options?: Omit<UseQueryOptions<CampaignEmailSchedule[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.campaignEmailSchedule.list(params),
    queryFn: () => apiGet<CampaignEmailSchedule[]>(`/campaign-email-schedule${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Campaign Email Schedule by ID.
 */
export function useCampaignEmailSchedule(
  id: string | undefined,
  options?: Omit<UseQueryOptions<CampaignEmailSchedule | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.campaignEmailSchedule.detail(id ?? ''),
    queryFn: () => apiGet<CampaignEmailSchedule | null>(`/campaign-email-schedule/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Campaign Email Schedule.
 * Automatically invalidates list queries on success.
 */
export function useCreateCampaignEmailSchedule(
  options?: UseMutationOptions<CampaignEmailSchedule, Error, Partial<CampaignEmailSchedule>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CampaignEmailSchedule>) => apiPost<CampaignEmailSchedule>('/campaign-email-schedule', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaignEmailSchedule.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Campaign Email Schedule.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateCampaignEmailSchedule(
  options?: UseMutationOptions<CampaignEmailSchedule, Error, { id: string; data: Partial<CampaignEmailSchedule> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CampaignEmailSchedule> }) =>
      apiPut<CampaignEmailSchedule>(`/campaign-email-schedule/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaignEmailSchedule.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.campaignEmailSchedule.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Campaign Email Schedule by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteCampaignEmailSchedule(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/campaign-email-schedule/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaignEmailSchedule.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
