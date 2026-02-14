// TanStack Query hooks for Opening Invoice Creation Tool
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { OpeningInvoiceCreationTool } from '../types/opening-invoice-creation-tool.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface OpeningInvoiceCreationToolListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Opening Invoice Creation Tool records.
 */
export function useOpeningInvoiceCreationToolList(
  params: OpeningInvoiceCreationToolListParams = {},
  options?: Omit<UseQueryOptions<OpeningInvoiceCreationTool[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.openingInvoiceCreationTool.list(params),
    queryFn: () => apiGet<OpeningInvoiceCreationTool[]>(`/opening-invoice-creation-tool${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Opening Invoice Creation Tool by ID.
 */
export function useOpeningInvoiceCreationTool(
  id: string | undefined,
  options?: Omit<UseQueryOptions<OpeningInvoiceCreationTool | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.openingInvoiceCreationTool.detail(id ?? ''),
    queryFn: () => apiGet<OpeningInvoiceCreationTool | null>(`/opening-invoice-creation-tool/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Opening Invoice Creation Tool.
 * Automatically invalidates list queries on success.
 */
export function useCreateOpeningInvoiceCreationTool(
  options?: UseMutationOptions<OpeningInvoiceCreationTool, Error, Partial<OpeningInvoiceCreationTool>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<OpeningInvoiceCreationTool>) => apiPost<OpeningInvoiceCreationTool>('/opening-invoice-creation-tool', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.openingInvoiceCreationTool.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Opening Invoice Creation Tool.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateOpeningInvoiceCreationTool(
  options?: UseMutationOptions<OpeningInvoiceCreationTool, Error, { id: string; data: Partial<OpeningInvoiceCreationTool> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<OpeningInvoiceCreationTool> }) =>
      apiPut<OpeningInvoiceCreationTool>(`/opening-invoice-creation-tool/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.openingInvoiceCreationTool.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.openingInvoiceCreationTool.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Opening Invoice Creation Tool by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteOpeningInvoiceCreationTool(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/opening-invoice-creation-tool/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.openingInvoiceCreationTool.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
