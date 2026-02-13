// TanStack Query hooks for Loyalty Program
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { LoyaltyProgram } from '../types/loyalty-program.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface LoyaltyProgramListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Loyalty Program records.
 */
export function useLoyaltyProgramList(
  params: LoyaltyProgramListParams = {},
  options?: Omit<UseQueryOptions<LoyaltyProgram[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.loyaltyProgram.list(params),
    queryFn: () => apiGet<LoyaltyProgram[]>(`/loyalty-program${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Loyalty Program by ID.
 */
export function useLoyaltyProgram(
  id: string | undefined,
  options?: Omit<UseQueryOptions<LoyaltyProgram | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.loyaltyProgram.detail(id ?? ''),
    queryFn: () => apiGet<LoyaltyProgram | null>(`/loyalty-program/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Loyalty Program.
 * Automatically invalidates list queries on success.
 */
export function useCreateLoyaltyProgram(
  options?: UseMutationOptions<LoyaltyProgram, Error, Partial<LoyaltyProgram>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<LoyaltyProgram>) => apiPost<LoyaltyProgram>('/loyalty-program', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.loyaltyProgram.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Loyalty Program.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateLoyaltyProgram(
  options?: UseMutationOptions<LoyaltyProgram, Error, { id: string; data: Partial<LoyaltyProgram> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LoyaltyProgram> }) =>
      apiPut<LoyaltyProgram>(`/loyalty-program/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.loyaltyProgram.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.loyaltyProgram.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Loyalty Program by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteLoyaltyProgram(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/loyalty-program/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.loyaltyProgram.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
