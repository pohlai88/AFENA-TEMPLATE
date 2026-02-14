import { orgEntityVersionsPage } from '@/lib/routes/app-routes';

export const SURFACE = {
  surfaceId: 'web.companies.versions.page',
  page: orgEntityVersionsPage('companies'),
  exposes: ['companies.versions'],
} as const;
