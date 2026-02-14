// TanStack Query hooks for Contract Template
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ContractTemplate } from '../types/contract-template.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ContractTemplateListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Contract Template records.
 */
export function useContractTemplateList(
  params: ContractTemplateListParams = {},
  options?: Omit<UseQueryOptions<ContractTemplate[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.contractTemplate.list(params),
    queryFn: () => apiGet<ContractTemplate[]>(`/contract-template${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Contract Template by ID.
 */
export function useContractTemplate(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ContractTemplate | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.contractTemplate.detail(id ?? ''),
    queryFn: () => apiGet<ContractTemplate | null>(`/contract-template/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Contract Template.
 * Automatically invalidates list queries on success.
 */
export function useCreateContractTemplate(
  options?: UseMutationOptions<ContractTemplate, Error, Partial<ContractTemplate>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ContractTemplate>) => apiPost<ContractTemplate>('/contract-template', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contractTemplate.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Contract Template.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateContractTemplate(
  options?: UseMutationOptions<ContractTemplate, Error, { id: string; data: Partial<ContractTemplate> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ContractTemplate> }) =>
      apiPut<ContractTemplate>(`/contract-template/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contractTemplate.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.contractTemplate.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Contract Template by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteContractTemplate(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/contract-template/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contractTemplate.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
