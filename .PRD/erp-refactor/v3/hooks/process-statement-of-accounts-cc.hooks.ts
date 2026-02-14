// TanStack Query hooks for Process Statement Of Accounts CC
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ProcessStatementOfAccountsCc } from '../types/process-statement-of-accounts-cc.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ProcessStatementOfAccountsCcListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Process Statement Of Accounts CC records.
 */
export function useProcessStatementOfAccountsCcList(
  params: ProcessStatementOfAccountsCcListParams = {},
  options?: Omit<UseQueryOptions<ProcessStatementOfAccountsCc[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.processStatementOfAccountsCc.list(params),
    queryFn: () => apiGet<ProcessStatementOfAccountsCc[]>(`/process-statement-of-accounts-cc${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Process Statement Of Accounts CC by ID.
 */
export function useProcessStatementOfAccountsCc(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ProcessStatementOfAccountsCc | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.processStatementOfAccountsCc.detail(id ?? ''),
    queryFn: () => apiGet<ProcessStatementOfAccountsCc | null>(`/process-statement-of-accounts-cc/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Process Statement Of Accounts CC.
 * Automatically invalidates list queries on success.
 */
export function useCreateProcessStatementOfAccountsCc(
  options?: UseMutationOptions<ProcessStatementOfAccountsCc, Error, Partial<ProcessStatementOfAccountsCc>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProcessStatementOfAccountsCc>) => apiPost<ProcessStatementOfAccountsCc>('/process-statement-of-accounts-cc', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processStatementOfAccountsCc.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Process Statement Of Accounts CC.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateProcessStatementOfAccountsCc(
  options?: UseMutationOptions<ProcessStatementOfAccountsCc, Error, { id: string; data: Partial<ProcessStatementOfAccountsCc> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProcessStatementOfAccountsCc> }) =>
      apiPut<ProcessStatementOfAccountsCc>(`/process-statement-of-accounts-cc/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processStatementOfAccountsCc.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.processStatementOfAccountsCc.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Process Statement Of Accounts CC by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteProcessStatementOfAccountsCc(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/process-statement-of-accounts-cc/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processStatementOfAccountsCc.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
