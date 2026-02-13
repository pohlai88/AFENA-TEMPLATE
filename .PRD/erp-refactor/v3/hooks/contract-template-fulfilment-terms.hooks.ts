// TanStack Query hooks for Contract Template Fulfilment Terms
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ContractTemplateFulfilmentTerms } from '../types/contract-template-fulfilment-terms.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ContractTemplateFulfilmentTermsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Contract Template Fulfilment Terms records.
 */
export function useContractTemplateFulfilmentTermsList(
  params: ContractTemplateFulfilmentTermsListParams = {},
  options?: Omit<UseQueryOptions<ContractTemplateFulfilmentTerms[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.contractTemplateFulfilmentTerms.list(params),
    queryFn: () => apiGet<ContractTemplateFulfilmentTerms[]>(`/contract-template-fulfilment-terms${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Contract Template Fulfilment Terms by ID.
 */
export function useContractTemplateFulfilmentTerms(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ContractTemplateFulfilmentTerms | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.contractTemplateFulfilmentTerms.detail(id ?? ''),
    queryFn: () => apiGet<ContractTemplateFulfilmentTerms | null>(`/contract-template-fulfilment-terms/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Contract Template Fulfilment Terms.
 * Automatically invalidates list queries on success.
 */
export function useCreateContractTemplateFulfilmentTerms(
  options?: UseMutationOptions<ContractTemplateFulfilmentTerms, Error, Partial<ContractTemplateFulfilmentTerms>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ContractTemplateFulfilmentTerms>) => apiPost<ContractTemplateFulfilmentTerms>('/contract-template-fulfilment-terms', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contractTemplateFulfilmentTerms.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Contract Template Fulfilment Terms.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateContractTemplateFulfilmentTerms(
  options?: UseMutationOptions<ContractTemplateFulfilmentTerms, Error, { id: string; data: Partial<ContractTemplateFulfilmentTerms> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ContractTemplateFulfilmentTerms> }) =>
      apiPut<ContractTemplateFulfilmentTerms>(`/contract-template-fulfilment-terms/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contractTemplateFulfilmentTerms.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.contractTemplateFulfilmentTerms.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Contract Template Fulfilment Terms by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteContractTemplateFulfilmentTerms(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/contract-template-fulfilment-terms/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contractTemplateFulfilmentTerms.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
