"use client";

// Column definitions for Opening Invoice Creation Tool
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { OpeningInvoiceCreationTool } from "../types/opening-invoice-creation-tool.js";

export const openingInvoiceCreationToolColumns: ColumnDef<OpeningInvoiceCreationTool>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "invoice_type",
    header: "Invoice Type",
  },
];