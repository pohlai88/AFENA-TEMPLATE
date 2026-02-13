"use client";

// Column definitions for Work Order
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { WorkOrder } from "../types/work-order.js";
import { Badge } from "@/components/ui/badge";

export const workOrderColumns: ColumnDef<WorkOrder>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "production_item",
    header: "Item To Manufacture",
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