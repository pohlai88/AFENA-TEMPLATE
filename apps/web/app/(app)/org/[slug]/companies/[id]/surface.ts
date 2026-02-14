import { orgEntityIdPage } from '@/lib/routes/app-routes';

export const SURFACE = {
  surfaceId: 'web.companies.detail.page',
  page: orgEntityIdPage('companies'),
  exposes: ['companies.read', 'companies.update', 'companies.delete'],
} as const;
