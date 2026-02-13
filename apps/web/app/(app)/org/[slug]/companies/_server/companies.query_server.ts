import { cache } from 'react';

import { getCompany, getCompanies, getDeletedCompanies } from '@/app/actions/companies';

import type { CompanyRow } from '../_components/company-columns';

export const listCompanies = cache(async (): Promise<CompanyRow[]> => {
  const response = await getCompanies({ limit: 100 });
  if (!response.ok) return [];
  return response.data as CompanyRow[];
});

export const readCompany = cache(async (id: string): Promise<CompanyRow | null> => {
  const response = await getCompany(id);
  if (!response.ok) return null;
  return response.data as CompanyRow;
});

export const listTrashedCompanies = cache(async (): Promise<CompanyRow[]> => {
  const response = await getDeletedCompanies({ limit: 100 });
  if (!response.ok) return [];
  return (response.data as CompanyRow[]).filter((r) => r.is_deleted);
});
