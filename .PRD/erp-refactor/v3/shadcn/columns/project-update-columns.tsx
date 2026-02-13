"use client";

// Column definitions for Project Update
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ProjectUpdate } from "../types/project-update.js";
import { Badge } from "@/components/ui/badge";

export const projectUpdateColumns: ColumnDef<ProjectUpdate>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "project",
    header: "Project",
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