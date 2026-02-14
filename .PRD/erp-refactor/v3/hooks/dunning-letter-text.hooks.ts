// TanStack Query hooks for Dunning Letter Text
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { DunningLetterText } from '../types/dunning-letter-text.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface DunningLetterTextListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Dunning Letter Text records.
 */
export function useDunningLetterTextList(
  params: DunningLetterTextListParams = {},
  options?: Omit<UseQueryOptions<DunningLetterText[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.dunningLetterText.list(params),
    queryFn: () => apiGet<DunningLetterText[]>(`/dunning-letter-text${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Dunning Letter Text by ID.
 */
export function useDunningLetterText(
  id: string | undefined,
  options?: Omit<UseQueryOptions<DunningLetterText | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.dunningLetterText.detail(id ?? ''),
    queryFn: () => apiGet<DunningLetterText | null>(`/dunning-letter-text/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Dunning Letter Text.
 * Automatically invalidates list queries on success.
 */
export function useCreateDunningLetterText(
  options?: UseMutationOptions<DunningLetterText, Error, Partial<DunningLetterText>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<DunningLetterText>) => apiPost<DunningLetterText>('/dunning-letter-text', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dunningLetterText.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Dunning Letter Text.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateDunningLetterText(
  options?: UseMutationOptions<DunningLetterText, Error, { id: string; data: Partial<DunningLetterText> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DunningLetterText> }) =>
      apiPut<DunningLetterText>(`/dunning-letter-text/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dunningLetterText.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dunningLetterText.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Dunning Letter Text by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteDunningLetterText(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/dunning-letter-text/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dunningLetterText.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
