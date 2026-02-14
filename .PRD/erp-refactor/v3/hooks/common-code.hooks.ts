// TanStack Query hooks for Common Code
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { CommonCode } from '../types/common-code.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface CommonCodeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Common Code records.
 */
export function useCommonCodeList(
  params: CommonCodeListParams = {},
  options?: Omit<UseQueryOptions<CommonCode[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.commonCode.list(params),
    queryFn: () => apiGet<CommonCode[]>(`/common-code${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Common Code by ID.
 */
export function useCommonCode(
  id: string | undefined,
  options?: Omit<UseQueryOptions<CommonCode | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.commonCode.detail(id ?? ''),
    queryFn: () => apiGet<CommonCode | null>(`/common-code/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Common Code.
 * Automatically invalidates list queries on success.
 */
export function useCreateCommonCode(
  options?: UseMutationOptions<CommonCode, Error, Partial<CommonCode>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CommonCode>) => apiPost<CommonCode>('/common-code', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.commonCode.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Common Code.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateCommonCode(
  options?: UseMutationOptions<CommonCode, Error, { id: string; data: Partial<CommonCode> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CommonCode> }) =>
      apiPut<CommonCode>(`/common-code/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.commonCode.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.commonCode.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Common Code by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteCommonCode(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/common-code/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.commonCode.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
