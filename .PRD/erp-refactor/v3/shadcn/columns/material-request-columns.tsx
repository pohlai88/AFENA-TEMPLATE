"use client";

// Column definitions for Material Request
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { MaterialRequest } from "../types/material-request.js";
import { Badge } from "@/components/ui/badge";

export const materialRequestColumns: ColumnDef<MaterialRequest>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "material_request_type",
    header: "Purpose",
  },
  {
    accessorKey: "schedule_date",
    header: "Required By",
    cell: ({ row }) => {
      const val = row.getValue("schedule_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "set_warehouse",
    header: "Set Target Warehouse",
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