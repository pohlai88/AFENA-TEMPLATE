"use client";

// Column definitions for Maintenance Visit
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { MaintenanceVisit } from "../types/maintenance-visit.js";
import { Badge } from "@/components/ui/badge";

export const maintenanceVisitColumns: ColumnDef<MaintenanceVisit>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "completion_status",
    header: "Completion Status",
  },
  {
    accessorKey: "maintenance_type",
    header: "Maintenance Type",
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