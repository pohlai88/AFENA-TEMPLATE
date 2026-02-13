export const SURFACE = {
  surfaceId: 'web.companies.list.page',
  page: '/org/[slug]/companies',
  exposes: ['companies.list', 'companies.create', 'companies.delete'],
} as const;
