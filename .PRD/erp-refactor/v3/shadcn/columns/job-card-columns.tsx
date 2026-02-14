"use client";

// Column definitions for Job Card
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { JobCard } from "../types/job-card.js";
import { Badge } from "@/components/ui/badge";

export const jobCardColumns: ColumnDef<JobCard>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "work_order",
    header: "Work Order",
  },
  {
    accessorKey: "for_quantity",
    header: "Qty To Manufacture",
  },
  {
    accessorKey: "operation",
    header: "Operation",
  },
  {
    accessorKey: "workstation",
    header: "Workstation",
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