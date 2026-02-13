// TanStack Query hooks for Item Tax Template
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ItemTaxTemplate } from '../types/item-tax-template.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ItemTaxTemplateListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Item Tax Template records.
 */
export function useItemTaxTemplateList(
  params: ItemTaxTemplateListParams = {},
  options?: Omit<UseQueryOptions<ItemTaxTemplate[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.itemTaxTemplate.list(params),
    queryFn: () => apiGet<ItemTaxTemplate[]>(`/item-tax-template${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Item Tax Template by ID.
 */
export function useItemTaxTemplate(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ItemTaxTemplate | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.itemTaxTemplate.detail(id ?? ''),
    queryFn: () => apiGet<ItemTaxTemplate | null>(`/item-tax-template/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Item Tax Template.
 * Automatically invalidates list queries on success.
 */
export function useCreateItemTaxTemplate(
  options?: UseMutationOptions<ItemTaxTemplate, Error, Partial<ItemTaxTemplate>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ItemTaxTemplate>) => apiPost<ItemTaxTemplate>('/item-tax-template', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemTaxTemplate.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Item Tax Template.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateItemTaxTemplate(
  options?: UseMutationOptions<ItemTaxTemplate, Error, { id: string; data: Partial<ItemTaxTemplate> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItemTaxTemplate> }) =>
      apiPut<ItemTaxTemplate>(`/item-tax-template/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemTaxTemplate.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.itemTaxTemplate.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Item Tax Template by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteItemTaxTemplate(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/item-tax-template/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemTaxTemplate.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
