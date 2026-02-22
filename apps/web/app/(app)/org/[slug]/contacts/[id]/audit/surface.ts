import { orgEntityAuditPage } from '@/lib/routes/app-routes';

export const SURFACE = {
  surfaceId: 'web.contacts.audit.page',
  page: orgEntityAuditPage('contacts'),
  exposes: ['contacts.audit'],
} as const;
