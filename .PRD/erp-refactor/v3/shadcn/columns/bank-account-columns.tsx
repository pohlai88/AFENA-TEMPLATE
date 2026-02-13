"use client";

// Column definitions for Bank Account
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { BankAccount } from "../types/bank-account.js";

export const bankAccountColumns: ColumnDef<BankAccount>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "account_name",
    header: "Account Name",
  },
  {
    accessorKey: "account",
    header: "Company Account",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "iban",
    header: "IBAN",
  },
  {
    accessorKey: "bank_account_no",
    header: "Bank Account No",
  },
];