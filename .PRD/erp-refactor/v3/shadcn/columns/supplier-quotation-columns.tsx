"use client";

// Column definitions for Supplier Quotation
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SupplierQuotation } from "../types/supplier-quotation.js";
import { Badge } from "@/components/ui/badge";

export const supplierQuotationColumns: ColumnDef<SupplierQuotation>[] = [
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
    accessorKey: "valid_till",
    header: "Valid Till",
    cell: ({ row }) => {
      const val = row.getValue("valid_till") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "grand_total",
    header: "Grand Total",
    cell: ({ row }) => {
      const val = row.getValue("grand_total") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
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