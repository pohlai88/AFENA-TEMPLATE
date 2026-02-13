export const SURFACE = {
  surfaceId: 'web.companies.trash.page',
  page: '/org/[slug]/companies/trash',
  exposes: ['companies.list', 'companies.restore'],
} as const;
