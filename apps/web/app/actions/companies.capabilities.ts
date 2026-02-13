/**
 * Capability keys for companies server actions.
 * Separated from companies.ts because Next.js 16 'use server' files
 * can only export async functions.
 */
export const CAPABILITIES = [
  'companies.create',
  'companies.update',
  'companies.delete',
  'companies.restore',
  'companies.read',
  'companies.list',
  'companies.versions',
  'companies.audit',
] as const;
