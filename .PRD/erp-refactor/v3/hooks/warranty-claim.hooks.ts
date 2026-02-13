// TanStack Query hooks for Warranty Claim
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { WarrantyClaim } from '../types/warranty-claim.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface WarrantyClaimListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Warranty Claim records.
 */
export function useWarrantyClaimList(
  params: WarrantyClaimListParams = {},
  options?: Omit<UseQueryOptions<WarrantyClaim[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.warrantyClaim.list(params),
    queryFn: () => apiGet<WarrantyClaim[]>(`/warranty-claim${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Warranty Claim by ID.
 */
export function useWarrantyClaim(
  id: string | undefined,
  options?: Omit<UseQueryOptions<WarrantyClaim | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.warrantyClaim.detail(id ?? ''),
    queryFn: () => apiGet<WarrantyClaim | null>(`/warranty-claim/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Warranty Claim.
 * Automatically invalidates list queries on success.
 */
export function useCreateWarrantyClaim(
  options?: UseMutationOptions<WarrantyClaim, Error, Partial<WarrantyClaim>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<WarrantyClaim>) => apiPost<WarrantyClaim>('/warranty-claim', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.warrantyClaim.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Warranty Claim.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateWarrantyClaim(
  options?: UseMutationOptions<WarrantyClaim, Error, { id: string; data: Partial<WarrantyClaim> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WarrantyClaim> }) =>
      apiPut<WarrantyClaim>(`/warranty-claim/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.warrantyClaim.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.warrantyClaim.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Warranty Claim by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteWarrantyClaim(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/warranty-claim/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.warrantyClaim.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
