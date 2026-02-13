// TanStack Query hooks for Contract Fulfilment Checklist
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ContractFulfilmentChecklist } from '../types/contract-fulfilment-checklist.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ContractFulfilmentChecklistListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Contract Fulfilment Checklist records.
 */
export function useContractFulfilmentChecklistList(
  params: ContractFulfilmentChecklistListParams = {},
  options?: Omit<UseQueryOptions<ContractFulfilmentChecklist[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.contractFulfilmentChecklist.list(params),
    queryFn: () => apiGet<ContractFulfilmentChecklist[]>(`/contract-fulfilment-checklist${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Contract Fulfilment Checklist by ID.
 */
export function useContractFulfilmentChecklist(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ContractFulfilmentChecklist | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.contractFulfilmentChecklist.detail(id ?? ''),
    queryFn: () => apiGet<ContractFulfilmentChecklist | null>(`/contract-fulfilment-checklist/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Contract Fulfilment Checklist.
 * Automatically invalidates list queries on success.
 */
export function useCreateContractFulfilmentChecklist(
  options?: UseMutationOptions<ContractFulfilmentChecklist, Error, Partial<ContractFulfilmentChecklist>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ContractFulfilmentChecklist>) => apiPost<ContractFulfilmentChecklist>('/contract-fulfilment-checklist', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contractFulfilmentChecklist.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Contract Fulfilment Checklist.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateContractFulfilmentChecklist(
  options?: UseMutationOptions<ContractFulfilmentChecklist, Error, { id: string; data: Partial<ContractFulfilmentChecklist> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ContractFulfilmentChecklist> }) =>
      apiPut<ContractFulfilmentChecklist>(`/contract-fulfilment-checklist/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contractFulfilmentChecklist.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.contractFulfilmentChecklist.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Contract Fulfilment Checklist by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteContractFulfilmentChecklist(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/contract-fulfilment-checklist/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contractFulfilmentChecklist.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Contract Fulfilment Checklist (set docstatus = 1).
 */
export function useSubmitContractFulfilmentChecklist(
  options?: UseMutationOptions<ContractFulfilmentChecklist, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<ContractFulfilmentChecklist>(`/contract-fulfilment-checklist/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contractFulfilmentChecklist.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.contractFulfilmentChecklist.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Contract Fulfilment Checklist (set docstatus = 2).
 */
export function useCancelContractFulfilmentChecklist(
  options?: UseMutationOptions<ContractFulfilmentChecklist, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<ContractFulfilmentChecklist>(`/contract-fulfilment-checklist/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contractFulfilmentChecklist.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.contractFulfilmentChecklist.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
