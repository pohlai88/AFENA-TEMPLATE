// TanStack Query hooks for Quality Review
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { QualityReview } from '../types/quality-review.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface QualityReviewListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Quality Review records.
 */
export function useQualityReviewList(
  params: QualityReviewListParams = {},
  options?: Omit<UseQueryOptions<QualityReview[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.qualityReview.list(params),
    queryFn: () => apiGet<QualityReview[]>(`/quality-review${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Quality Review by ID.
 */
export function useQualityReview(
  id: string | undefined,
  options?: Omit<UseQueryOptions<QualityReview | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.qualityReview.detail(id ?? ''),
    queryFn: () => apiGet<QualityReview | null>(`/quality-review/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Quality Review.
 * Automatically invalidates list queries on success.
 */
export function useCreateQualityReview(
  options?: UseMutationOptions<QualityReview, Error, Partial<QualityReview>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<QualityReview>) => apiPost<QualityReview>('/quality-review', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityReview.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Quality Review.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateQualityReview(
  options?: UseMutationOptions<QualityReview, Error, { id: string; data: Partial<QualityReview> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<QualityReview> }) =>
      apiPut<QualityReview>(`/quality-review/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityReview.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityReview.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Quality Review by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteQualityReview(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/quality-review/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityReview.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
