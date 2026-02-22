import { orgEntityEditPage } from '@/lib/routes/app-routes';

export const SURFACE = {
  surfaceId: 'web.companies.edit.page',
  page: orgEntityEditPage('companies'),
  exposes: ['companies.update'],
} as const;
