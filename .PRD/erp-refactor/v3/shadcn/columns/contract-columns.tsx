"use client";

// Column definitions for Contract
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Contract } from "../types/contract.js";
import { Badge } from "@/components/ui/badge";

export const contractColumns: ColumnDef<Contract>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "fulfilment_status",
    header: "Fulfilment Status",
  },
  {
    accessorKey: "signed_on",
    header: "Signed On",
    cell: ({ row }) => {
      const val = row.getValue("signed_on") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "contract_terms",
    header: "Contract Terms",
  },
  {
    accessorKey: "document_name",
    header: "Document Name",
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