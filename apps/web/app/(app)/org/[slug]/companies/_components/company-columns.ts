import { textColumn, dateColumn } from '../../_components/crud/client/entity-columns';

import type { ColumnDef } from '@tanstack/react-table';

export interface CompanyRow {
  id: string;
  name: string;
  legal_name: string | null;
  registration_no: string | null;
  tax_id: string | null;
  base_currency: string;
  fiscal_year_start: number | null;
  address: unknown;
  version: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export const companyColumns: ColumnDef<CompanyRow, unknown>[] = [
  textColumn<CompanyRow>('name', 'Name'),
  textColumn<CompanyRow>('legal_name', 'Legal Name'),
  textColumn<CompanyRow>('registration_no', 'Reg. No.'),
  textColumn<CompanyRow>('tax_id', 'Tax ID'),
  textColumn<CompanyRow>('base_currency', 'Currency'),
  dateColumn<CompanyRow>('created_at', 'Created'),
];
