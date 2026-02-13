// TanStack Query hooks for Industry Type
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { IndustryType } from '../types/industry-type.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface IndustryTypeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Industry Type records.
 */
export function useIndustryTypeList(
  params: IndustryTypeListParams = {},
  options?: Omit<UseQueryOptions<IndustryType[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.industryType.list(params),
    queryFn: () => apiGet<IndustryType[]>(`/industry-type${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Industry Type by ID.
 */
export function useIndustryType(
  id: string | undefined,
  options?: Omit<UseQueryOptions<IndustryType | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.industryType.detail(id ?? ''),
    queryFn: () => apiGet<IndustryType | null>(`/industry-type/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Industry Type.
 * Automatically invalidates list queries on success.
 */
export function useCreateIndustryType(
  options?: UseMutationOptions<IndustryType, Error, Partial<IndustryType>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<IndustryType>) => apiPost<IndustryType>('/industry-type', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.industryType.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Industry Type.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateIndustryType(
  options?: UseMutationOptions<IndustryType, Error, { id: string; data: Partial<IndustryType> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IndustryType> }) =>
      apiPut<IndustryType>(`/industry-type/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.industryType.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.industryType.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Industry Type by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteIndustryType(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/industry-type/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.industryType.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
