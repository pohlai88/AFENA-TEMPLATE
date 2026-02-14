"use client";

// Column definitions for Bank Statement Import
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { BankStatementImport } from "../types/bank-statement-import.js";

export const bankStatementImportColumns: ColumnDef<BankStatementImport>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "import_file",
    header: "Import File",
  },
  {
    accessorKey: "reference_doctype",
    header: "Document Type",
  },
  {
    accessorKey: "import_type",
    header: "Import Type",
  },
];