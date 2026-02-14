import { orgEntityNewPage } from '@/lib/routes/app-routes';

export const SURFACE = {
  surfaceId: 'web.companies.new.page',
  page: orgEntityNewPage('companies'),
  exposes: ['companies.create'],
} as const;
