"use client";

// Column definitions for Bank Account Subtype
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { BankAccountSubtype } from "../types/bank-account-subtype.js";

export const bankAccountSubtypeColumns: ColumnDef<BankAccountSubtype>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "account_subtype",
    header: "Account Subtype",
  },
];