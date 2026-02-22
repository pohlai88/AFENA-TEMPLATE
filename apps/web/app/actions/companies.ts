'use server';

import { generateEntityActions } from '@/lib/actions/entity-actions';

import type { ApiResponse, JsonValue } from 'afenda-canon';

// CAPABILITIES moved to companies.capabilities.ts (Next.js 16: 'use server' files can only export async functions)

const actions = generateEntityActions('companies');

export async function createCompany(input: JsonValue): Promise<ApiResponse> { return actions.create(input); }
export async function updateCompany(id: string, expectedVersion: number, input: JsonValue): Promise<ApiResponse> { return actions.update(id, expectedVersion, input); }
export async function deleteCompany(id: string, expectedVersion: number): Promise<ApiResponse> { return actions.remove(id, expectedVersion); }
export async function restoreCompany(id: string, expectedVersion: number): Promise<ApiResponse> { return actions.restore(id, expectedVersion); }
export async function getCompany(id: string): Promise<ApiResponse> { return actions.read(id); }
export async function getCompanies(options?: { includeDeleted?: boolean; limit?: number; offset?: number }): Promise<ApiResponse> { return actions.list(options); }
export async function getDeletedCompanies(options?: { limit?: number }): Promise<ApiResponse> { return actions.list({ ...options, includeDeleted: true }); }
export async function getCompanyVersions(id: string): Promise<ApiResponse> { return actions.getVersions(id); }
export async function getCompanyAuditLogs(id: string): Promise<ApiResponse> { return actions.getAuditLogs(id); }
