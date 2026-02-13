"use client";

// Column definitions for Tax Withholding Account
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { TaxWithholdingAccount } from "../types/tax-withholding-account.js";

export const taxWithholdingAccountColumns: ColumnDef<TaxWithholdingAccount>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "account",
    header: "Account",
  },
];