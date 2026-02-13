"use client";

// Column definitions for Cheque Print Template
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ChequePrintTemplate } from "../types/cheque-print-template.js";

export const chequePrintTemplateColumns: ColumnDef<ChequePrintTemplate>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "bank_name",
    header: "Bank Name",
  },
];