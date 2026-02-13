// TanStack Query hooks for Loyalty Program Collection
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { LoyaltyProgramCollection } from '../types/loyalty-program-collection.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface LoyaltyProgramCollectionListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Loyalty Program Collection records.
 */
export function useLoyaltyProgramCollectionList(
  params: LoyaltyProgramCollectionListParams = {},
  options?: Omit<UseQueryOptions<LoyaltyProgramCollection[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.loyaltyProgramCollection.list(params),
    queryFn: () => apiGet<LoyaltyProgramCollection[]>(`/loyalty-program-collection${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Loyalty Program Collection by ID.
 */
export function useLoyaltyProgramCollection(
  id: string | undefined,
  options?: Omit<UseQueryOptions<LoyaltyProgramCollection | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.loyaltyProgramCollection.detail(id ?? ''),
    queryFn: () => apiGet<LoyaltyProgramCollection | null>(`/loyalty-program-collection/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Loyalty Program Collection.
 * Automatically invalidates list queries on success.
 */
export function useCreateLoyaltyProgramCollection(
  options?: UseMutationOptions<LoyaltyProgramCollection, Error, Partial<LoyaltyProgramCollection>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<LoyaltyProgramCollection>) => apiPost<LoyaltyProgramCollection>('/loyalty-program-collection', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.loyaltyProgramCollection.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Loyalty Program Collection.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateLoyaltyProgramCollection(
  options?: UseMutationOptions<LoyaltyProgramCollection, Error, { id: string; data: Partial<LoyaltyProgramCollection> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LoyaltyProgramCollection> }) =>
      apiPut<LoyaltyProgramCollection>(`/loyalty-program-collection/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.loyaltyProgramCollection.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.loyaltyProgramCollection.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Loyalty Program Collection by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteLoyaltyProgramCollection(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/loyalty-program-collection/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.loyaltyProgramCollection.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
