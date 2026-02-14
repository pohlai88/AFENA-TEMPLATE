"use client";

// Column definitions for Request for Quotation
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { RequestForQuotation } from "../types/request-for-quotation.js";
import { Badge } from "@/components/ui/badge";

export const requestForQuotationColumns: ColumnDef<RequestForQuotation>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "naming_series",
    header: "Series",
  },
  {
    accessorKey: "company",
    header: "Company",
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
    accessorKey: "message_for_supplier",
    header: "Message for Supplier",
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