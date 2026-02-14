// TanStack Query hooks for Subcontracting Inward Order Scrap Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SubcontractingInwardOrderScrapItem } from '../types/subcontracting-inward-order-scrap-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SubcontractingInwardOrderScrapItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Subcontracting Inward Order Scrap Item records.
 */
export function useSubcontractingInwardOrderScrapItemList(
  params: SubcontractingInwardOrderScrapItemListParams = {},
  options?: Omit<UseQueryOptions<SubcontractingInwardOrderScrapItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.subcontractingInwardOrderScrapItem.list(params),
    queryFn: () => apiGet<SubcontractingInwardOrderScrapItem[]>(`/subcontracting-inward-order-scrap-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Subcontracting Inward Order Scrap Item by ID.
 */
export function useSubcontractingInwardOrderScrapItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SubcontractingInwardOrderScrapItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.subcontractingInwardOrderScrapItem.detail(id ?? ''),
    queryFn: () => apiGet<SubcontractingInwardOrderScrapItem | null>(`/subcontracting-inward-order-scrap-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Subcontracting Inward Order Scrap Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateSubcontractingInwardOrderScrapItem(
  options?: UseMutationOptions<SubcontractingInwardOrderScrapItem, Error, Partial<SubcontractingInwardOrderScrapItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SubcontractingInwardOrderScrapItem>) => apiPost<SubcontractingInwardOrderScrapItem>('/subcontracting-inward-order-scrap-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingInwardOrderScrapItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Subcontracting Inward Order Scrap Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSubcontractingInwardOrderScrapItem(
  options?: UseMutationOptions<SubcontractingInwardOrderScrapItem, Error, { id: string; data: Partial<SubcontractingInwardOrderScrapItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SubcontractingInwardOrderScrapItem> }) =>
      apiPut<SubcontractingInwardOrderScrapItem>(`/subcontracting-inward-order-scrap-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingInwardOrderScrapItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingInwardOrderScrapItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Subcontracting Inward Order Scrap Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSubcontractingInwardOrderScrapItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/subcontracting-inward-order-scrap-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingInwardOrderScrapItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
