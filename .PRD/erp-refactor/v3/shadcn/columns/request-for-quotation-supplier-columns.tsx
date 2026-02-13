"use client";

// Column definitions for Request for Quotation Supplier
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { RequestForQuotationSupplier } from "../types/request-for-quotation-supplier.js";

export const requestForQuotationSupplierColumns: ColumnDef<RequestForQuotationSupplier>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
  },
  {
    accessorKey: "contact",
    header: "Contact",
  },
  {
    accessorKey: "email_id",
    header: "Email ID",
  },
  {
    accessorKey: "send_email",
    header: "Send Email",
    cell: ({ row }) => row.getValue("send_email") ? "Yes" : "No",
  },
];