export const SURFACE = {
  surfaceId: 'web.companies.detail.page',
  page: '/org/[slug]/companies/[id]',
  exposes: ['companies.read', 'companies.update', 'companies.delete'],
} as const;
