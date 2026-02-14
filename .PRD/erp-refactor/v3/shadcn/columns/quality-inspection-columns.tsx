"use client";

// Column definitions for Quality Inspection
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { QualityInspection } from "../types/quality-inspection.js";
import { Badge } from "@/components/ui/badge";

export const qualityInspectionColumns: ColumnDef<QualityInspection>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "report_date",
    header: "Report Date",
    cell: ({ row }) => {
      const val = row.getValue("report_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "inspection_type",
    header: "Inspection Type",
  },
  {
    accessorKey: "reference_name",
    header: "Reference Name",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
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