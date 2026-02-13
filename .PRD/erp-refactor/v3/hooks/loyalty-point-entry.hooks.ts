// TanStack Query hooks for Loyalty Point Entry
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { LoyaltyPointEntry } from '../types/loyalty-point-entry.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface LoyaltyPointEntryListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Loyalty Point Entry records.
 */
export function useLoyaltyPointEntryList(
  params: LoyaltyPointEntryListParams = {},
  options?: Omit<UseQueryOptions<LoyaltyPointEntry[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.loyaltyPointEntry.list(params),
    queryFn: () => apiGet<LoyaltyPointEntry[]>(`/loyalty-point-entry${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Loyalty Point Entry by ID.
 */
export function useLoyaltyPointEntry(
  id: string | undefined,
  options?: Omit<UseQueryOptions<LoyaltyPointEntry | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.loyaltyPointEntry.detail(id ?? ''),
    queryFn: () => apiGet<LoyaltyPointEntry | null>(`/loyalty-point-entry/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Loyalty Point Entry.
 * Automatically invalidates list queries on success.
 */
export function useCreateLoyaltyPointEntry(
  options?: UseMutationOptions<LoyaltyPointEntry, Error, Partial<LoyaltyPointEntry>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<LoyaltyPointEntry>) => apiPost<LoyaltyPointEntry>('/loyalty-point-entry', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.loyaltyPointEntry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Loyalty Point Entry.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateLoyaltyPointEntry(
  options?: UseMutationOptions<LoyaltyPointEntry, Error, { id: string; data: Partial<LoyaltyPointEntry> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LoyaltyPointEntry> }) =>
      apiPut<LoyaltyPointEntry>(`/loyalty-point-entry/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.loyaltyPointEntry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.loyaltyPointEntry.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Loyalty Point Entry by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteLoyaltyPointEntry(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/loyalty-point-entry/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.loyaltyPointEntry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
