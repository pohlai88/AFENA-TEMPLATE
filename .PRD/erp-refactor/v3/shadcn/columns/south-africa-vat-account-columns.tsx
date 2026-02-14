"use client";

// Column definitions for South Africa VAT Account
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SouthAfricaVatAccount } from "../types/south-africa-vat-account.js";

export const southAfricaVatAccountColumns: ColumnDef<SouthAfricaVatAccount>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "account",
    header: "Account",
  },
];