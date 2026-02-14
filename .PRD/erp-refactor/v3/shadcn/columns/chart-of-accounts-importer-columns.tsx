"use client";

// Column definitions for Chart of Accounts Importer
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ChartOfAccountsImporter } from "../types/chart-of-accounts-importer.js";

export const chartOfAccountsImporterColumns: ColumnDef<ChartOfAccountsImporter>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
];