// TanStack Query hooks for Loyalty Point Entry Redemption
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { LoyaltyPointEntryRedemption } from '../types/loyalty-point-entry-redemption.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface LoyaltyPointEntryRedemptionListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Loyalty Point Entry Redemption records.
 */
export function useLoyaltyPointEntryRedemptionList(
  params: LoyaltyPointEntryRedemptionListParams = {},
  options?: Omit<UseQueryOptions<LoyaltyPointEntryRedemption[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.loyaltyPointEntryRedemption.list(params),
    queryFn: () => apiGet<LoyaltyPointEntryRedemption[]>(`/loyalty-point-entry-redemption${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Loyalty Point Entry Redemption by ID.
 */
export function useLoyaltyPointEntryRedemption(
  id: string | undefined,
  options?: Omit<UseQueryOptions<LoyaltyPointEntryRedemption | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.loyaltyPointEntryRedemption.detail(id ?? ''),
    queryFn: () => apiGet<LoyaltyPointEntryRedemption | null>(`/loyalty-point-entry-redemption/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Loyalty Point Entry Redemption.
 * Automatically invalidates list queries on success.
 */
export function useCreateLoyaltyPointEntryRedemption(
  options?: UseMutationOptions<LoyaltyPointEntryRedemption, Error, Partial<LoyaltyPointEntryRedemption>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<LoyaltyPointEntryRedemption>) => apiPost<LoyaltyPointEntryRedemption>('/loyalty-point-entry-redemption', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.loyaltyPointEntryRedemption.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Loyalty Point Entry Redemption.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateLoyaltyPointEntryRedemption(
  options?: UseMutationOptions<LoyaltyPointEntryRedemption, Error, { id: string; data: Partial<LoyaltyPointEntryRedemption> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LoyaltyPointEntryRedemption> }) =>
      apiPut<LoyaltyPointEntryRedemption>(`/loyalty-point-entry-redemption/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.loyaltyPointEntryRedemption.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.loyaltyPointEntryRedemption.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Loyalty Point Entry Redemption by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteLoyaltyPointEntryRedemption(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/loyalty-point-entry-redemption/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.loyaltyPointEntryRedemption.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
