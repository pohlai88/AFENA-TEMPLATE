// TanStack Query hooks for Landed Cost Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { LandedCostItem } from '../types/landed-cost-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface LandedCostItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Landed Cost Item records.
 */
export function useLandedCostItemList(
  params: LandedCostItemListParams = {},
  options?: Omit<UseQueryOptions<LandedCostItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.landedCostItem.list(params),
    queryFn: () => apiGet<LandedCostItem[]>(`/landed-cost-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Landed Cost Item by ID.
 */
export function useLandedCostItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<LandedCostItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.landedCostItem.detail(id ?? ''),
    queryFn: () => apiGet<LandedCostItem | null>(`/landed-cost-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Landed Cost Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateLandedCostItem(
  options?: UseMutationOptions<LandedCostItem, Error, Partial<LandedCostItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<LandedCostItem>) => apiPost<LandedCostItem>('/landed-cost-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.landedCostItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Landed Cost Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateLandedCostItem(
  options?: UseMutationOptions<LandedCostItem, Error, { id: string; data: Partial<LandedCostItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LandedCostItem> }) =>
      apiPut<LandedCostItem>(`/landed-cost-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.landedCostItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.landedCostItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Landed Cost Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteLandedCostItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/landed-cost-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.landedCostItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
