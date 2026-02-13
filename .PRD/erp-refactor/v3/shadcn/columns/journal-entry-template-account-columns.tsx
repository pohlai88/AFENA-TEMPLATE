"use client";

// Column definitions for Journal Entry Template Account
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { JournalEntryTemplateAccount } from "../types/journal-entry-template-account.js";

export const journalEntryTemplateAccountColumns: ColumnDef<JournalEntryTemplateAccount>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "account",
    header: "Account",
  },
  {
    accessorKey: "party_type",
    header: "Party Type",
  },
  {
    accessorKey: "party",
    header: "Party",
  },
];