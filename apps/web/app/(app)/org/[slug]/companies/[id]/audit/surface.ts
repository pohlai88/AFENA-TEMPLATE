import { orgEntityAuditPage } from '@/lib/routes/app-routes';

export const SURFACE = {
  surfaceId: 'web.companies.audit.page',
  page: orgEntityAuditPage('companies'),
  exposes: ['companies.audit'],
} as const;
