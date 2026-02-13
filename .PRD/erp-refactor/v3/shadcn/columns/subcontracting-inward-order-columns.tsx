"use client";

// Column definitions for Subcontracting Inward Order
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SubcontractingInwardOrder } from "../types/subcontracting-inward-order.js";
import { Badge } from "@/components/ui/badge";

export const subcontractingInwardOrderColumns: ColumnDef<SubcontractingInwardOrder>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "transaction_date",
    header: "Date",
    cell: ({ row }) => {
      const val = row.getValue("transaction_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "per_raw_material_received",
    header: "% Raw Material Received",
  },
  {
    accessorKey: "per_produced",
    header: "% Produced",
  },
  {
    accessorKey: "per_delivered",
    header: "% Delivered",
  },
  {
    accessorKey: "per_raw_material_returned",
    header: "% Raw Material Returned",
  },
  {
    accessorKey: "per_process_loss",
    header: "% Process Loss",
  },
  {
    accessorKey: "per_returned",
    header: "% Returned",
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