"use client";

// Column definitions for Contract Fulfilment Checklist
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ContractFulfilmentChecklist } from "../types/contract-fulfilment-checklist.js";
import { Badge } from "@/components/ui/badge";

export const contractFulfilmentChecklistColumns: ColumnDef<ContractFulfilmentChecklist>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "fulfilled",
    header: "Fulfilled",
    cell: ({ row }) => row.getValue("fulfilled") ? "Yes" : "No",
  },
  {
    accessorKey: "requirement",
    header: "Requirement",
  },
  {
    accessorKey: "notes",
    header: "Notes",
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