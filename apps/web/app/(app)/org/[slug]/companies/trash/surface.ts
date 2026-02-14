import { orgEntityTrashPage } from '@/lib/routes/app-routes';

export const SURFACE = {
  surfaceId: 'web.companies.trash.page',
  page: orgEntityTrashPage('companies'),
  exposes: ['companies.list', 'companies.restore'],
} as const;
