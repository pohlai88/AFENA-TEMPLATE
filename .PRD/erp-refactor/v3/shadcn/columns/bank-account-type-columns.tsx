"use client";

// Column definitions for Bank Account Type
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { BankAccountType } from "../types/bank-account-type.js";

export const bankAccountTypeColumns: ColumnDef<BankAccountType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "account_type",
    header: "Account Type",
  },
];