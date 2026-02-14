// TanStack Query hooks for Market Segment
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { MarketSegment } from '../types/market-segment.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface MarketSegmentListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Market Segment records.
 */
export function useMarketSegmentList(
  params: MarketSegmentListParams = {},
  options?: Omit<UseQueryOptions<MarketSegment[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.marketSegment.list(params),
    queryFn: () => apiGet<MarketSegment[]>(`/market-segment${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Market Segment by ID.
 */
export function useMarketSegment(
  id: string | undefined,
  options?: Omit<UseQueryOptions<MarketSegment | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.marketSegment.detail(id ?? ''),
    queryFn: () => apiGet<MarketSegment | null>(`/market-segment/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Market Segment.
 * Automatically invalidates list queries on success.
 */
export function useCreateMarketSegment(
  options?: UseMutationOptions<MarketSegment, Error, Partial<MarketSegment>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<MarketSegment>) => apiPost<MarketSegment>('/market-segment', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.marketSegment.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Market Segment.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateMarketSegment(
  options?: UseMutationOptions<MarketSegment, Error, { id: string; data: Partial<MarketSegment> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MarketSegment> }) =>
      apiPut<MarketSegment>(`/market-segment/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.marketSegment.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.marketSegment.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Market Segment by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteMarketSegment(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/market-segment/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.marketSegment.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
