"use client";

// Column definitions for Mode of Payment Account
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ModeOfPaymentAccount } from "../types/mode-of-payment-account.js";

export const modeOfPaymentAccountColumns: ColumnDef<ModeOfPaymentAccount>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "default_account",
    header: "Default Account",
  },
];