'use client';

import { textColumn, dateColumn } from '../../_components/crud/client/entity-columns';

import type { ColumnDef } from '@tanstack/react-table';

export interface ContactRow {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  notes: string | null;
  doc_status: string | null;
  version: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export const contactColumns: ColumnDef<ContactRow, unknown>[] = [
  textColumn<ContactRow>('name', 'Name'),
  textColumn<ContactRow>('email', 'Email'),
  textColumn<ContactRow>('phone', 'Phone'),
  textColumn<ContactRow>('company', 'Company'),
  dateColumn<ContactRow>('created_at', 'Created'),
];
