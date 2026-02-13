// TanStack Query hooks for Bank Clearance
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BankClearance } from '../types/bank-clearance.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BankClearanceListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Bank Clearance records.
 */
export function useBankClearanceList(
  params: BankClearanceListParams = {},
  options?: Omit<UseQueryOptions<BankClearance[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.bankClearance.list(params),
    queryFn: () => apiGet<BankClearance[]>(`/bank-clearance${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Bank Clearance by ID.
 */
export function useBankClearance(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BankClearance | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.bankClearance.detail(id ?? ''),
    queryFn: () => apiGet<BankClearance | null>(`/bank-clearance/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Bank Clearance.
 * Automatically invalidates list queries on success.
 */
export function useCreateBankClearance(
  options?: UseMutationOptions<BankClearance, Error, Partial<BankClearance>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BankClearance>) => apiPost<BankClearance>('/bank-clearance', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankClearance.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Bank Clearance.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBankClearance(
  options?: UseMutationOptions<BankClearance, Error, { id: string; data: Partial<BankClearance> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BankClearance> }) =>
      apiPut<BankClearance>(`/bank-clearance/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankClearance.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bankClearance.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Bank Clearance by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBankClearance(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/bank-clearance/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankClearance.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
