// TanStack Query hooks for Contract
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Contract } from '../types/contract.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ContractListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Contract records.
 */
export function useContractList(
  params: ContractListParams = {},
  options?: Omit<UseQueryOptions<Contract[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.contract.list(params),
    queryFn: () => apiGet<Contract[]>(`/contract${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Contract by ID.
 */
export function useContract(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Contract | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.contract.detail(id ?? ''),
    queryFn: () => apiGet<Contract | null>(`/contract/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Contract.
 * Automatically invalidates list queries on success.
 */
export function useCreateContract(
  options?: UseMutationOptions<Contract, Error, Partial<Contract>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Contract>) => apiPost<Contract>('/contract', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contract.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Contract.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateContract(
  options?: UseMutationOptions<Contract, Error, { id: string; data: Partial<Contract> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Contract> }) =>
      apiPut<Contract>(`/contract/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contract.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.contract.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Contract by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteContract(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/contract/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contract.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Contract (set docstatus = 1).
 */
export function useSubmitContract(
  options?: UseMutationOptions<Contract, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<Contract>(`/contract/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contract.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.contract.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Contract (set docstatus = 2).
 */
export function useCancelContract(
  options?: UseMutationOptions<Contract, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<Contract>(`/contract/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contract.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.contract.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
