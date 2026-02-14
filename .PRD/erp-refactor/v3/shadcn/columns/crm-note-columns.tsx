"use client";

// Column definitions for CRM Note
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { CrmNote } from "../types/crm-note.js";

export const crmNoteColumns: ColumnDef<CrmNote>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "note",
    header: "Note",
  },
  {
    accessorKey: "added_by",
    header: "Added By",
  },
  {
    accessorKey: "added_on",
    header: "Added On",
    cell: ({ row }) => {
      const val = row.getValue("added_on") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
];