"use client";

// Column definitions for UAE VAT Account
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { UaeVatAccount } from "../types/uae-vat-account.js";

export const uaeVatAccountColumns: ColumnDef<UaeVatAccount>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "account",
    header: "Account",
  },
];