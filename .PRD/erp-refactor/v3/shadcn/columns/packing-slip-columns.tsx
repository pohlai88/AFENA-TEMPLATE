"use client";

// Column definitions for Packing Slip
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PackingSlip } from "../types/packing-slip.js";
import { Badge } from "@/components/ui/badge";

export const packingSlipColumns: ColumnDef<PackingSlip>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "delivery_note",
    header: "Delivery Note",
  },
  {
    accessorKey: "from_case_no",
    header: "From Package No.",
  },
  {
    accessorKey: "to_case_no",
    header: "To Package No.",
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