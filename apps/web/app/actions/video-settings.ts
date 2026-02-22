'use server';

import { generateEntityActions } from '@/lib/actions/entity-actions';

import type { ApiResponse } from 'afenda-canon';

const actions = generateEntityActions('video-settings' as Parameters<typeof generateEntityActions>[0]);

export async function createVideoSettings(input: {
  enableYoutubeTracking?: boolean;
  apiKey?: string;
  frequency?: string;
}): Promise<ApiResponse> {
  return actions.create(input);
}

export async function updateVideoSettings(
  id: string,
  expectedVersion: number,
  input: {
    enableYoutubeTracking?: boolean;
    apiKey?: string;
    frequency?: string;
  },
): Promise<ApiResponse> {
  return actions.update(id, expectedVersion, input);
}

export async function deleteVideoSettings(
  id: string,
  expectedVersion: number,
): Promise<ApiResponse> {
  return actions.remove(id, expectedVersion);
}

export async function restoreVideoSettings(
  id: string,
  expectedVersion: number,
): Promise<ApiResponse> {
  return actions.restore(id, expectedVersion);
}

export async function listVideoSettings(options?: {
  limit?: number;
  orgId?: string;
}): Promise<ApiResponse> {
  return actions.list(options);
}

export async function readVideoSettings(id: string): Promise<ApiResponse> {
  return actions.read(id);
}
