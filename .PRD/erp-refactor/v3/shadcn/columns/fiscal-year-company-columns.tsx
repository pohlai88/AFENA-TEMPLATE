"use client";

// Column definitions for Fiscal Year Company
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { FiscalYearCompany } from "../types/fiscal-year-company.js";

export const fiscalYearCompanyColumns: ColumnDef<FiscalYearCompany>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
];