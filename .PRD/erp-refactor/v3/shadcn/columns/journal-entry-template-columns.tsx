"use client";

// Column definitions for Journal Entry Template
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { JournalEntryTemplate } from "../types/journal-entry-template.js";

export const journalEntryTemplateColumns: ColumnDef<JournalEntryTemplate>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "voucher_type",
    header: "Journal Entry Type",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
];