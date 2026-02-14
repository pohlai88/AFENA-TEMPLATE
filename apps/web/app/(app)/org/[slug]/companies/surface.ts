import { orgEntityPage } from '@/lib/routes/app-routes';

export const SURFACE = {
  surfaceId: 'web.companies.list.page',
  page: orgEntityPage('companies'),
  exposes: ['companies.list', 'companies.create', 'companies.delete'],
} as const;
