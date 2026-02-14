"use client";

// Column definitions for Installation Note
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { InstallationNote } from "../types/installation-note.js";
import { Badge } from "@/components/ui/badge";

export const installationNoteColumns: ColumnDef<InstallationNote>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
  },
  {
    id: "docstatus",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.original as any).docstatus;
      return (
        <Badge variant={status === 1 ? "default" : "secondary"}>
          {status === 0 ? "Draft" : status === 1 ? "Submitted" : "Cancelled"}
        </Badge>
      );
    },
  },
];