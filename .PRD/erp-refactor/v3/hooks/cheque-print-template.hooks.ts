// TanStack Query hooks for Cheque Print Template
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ChequePrintTemplate } from '../types/cheque-print-template.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ChequePrintTemplateListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Cheque Print Template records.
 */
export function useChequePrintTemplateList(
  params: ChequePrintTemplateListParams = {},
  options?: Omit<UseQueryOptions<ChequePrintTemplate[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.chequePrintTemplate.list(params),
    queryFn: () => apiGet<ChequePrintTemplate[]>(`/cheque-print-template${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Cheque Print Template by ID.
 */
export function useChequePrintTemplate(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ChequePrintTemplate | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.chequePrintTemplate.detail(id ?? ''),
    queryFn: () => apiGet<ChequePrintTemplate | null>(`/cheque-print-template/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Cheque Print Template.
 * Automatically invalidates list queries on success.
 */
export function useCreateChequePrintTemplate(
  options?: UseMutationOptions<ChequePrintTemplate, Error, Partial<ChequePrintTemplate>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ChequePrintTemplate>) => apiPost<ChequePrintTemplate>('/cheque-print-template', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chequePrintTemplate.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Cheque Print Template.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateChequePrintTemplate(
  options?: UseMutationOptions<ChequePrintTemplate, Error, { id: string; data: Partial<ChequePrintTemplate> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ChequePrintTemplate> }) =>
      apiPut<ChequePrintTemplate>(`/cheque-print-template/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chequePrintTemplate.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.chequePrintTemplate.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Cheque Print Template by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteChequePrintTemplate(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/cheque-print-template/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chequePrintTemplate.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
