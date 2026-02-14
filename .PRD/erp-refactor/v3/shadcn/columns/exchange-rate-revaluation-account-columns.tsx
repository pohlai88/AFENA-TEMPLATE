"use client";

// Column definitions for Exchange Rate Revaluation Account
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ExchangeRateRevaluationAccount } from "../types/exchange-rate-revaluation-account.js";

export const exchangeRateRevaluationAccountColumns: ColumnDef<ExchangeRateRevaluationAccount>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "account",
    header: "Account",
  },
  {
    accessorKey: "new_exchange_rate",
    header: "New Exchange Rate",
  },
  {
    accessorKey: "balance_in_base_currency",
    header: "Balance In Base Currency",
    cell: ({ row }) => {
      const val = row.getValue("balance_in_base_currency") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "new_balance_in_base_currency",
    header: "New Balance In Base Currency",
    cell: ({ row }) => {
      const val = row.getValue("new_balance_in_base_currency") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "gain_loss",
    header: "Gain/Loss",
    cell: ({ row }) => {
      const val = row.getValue("gain_loss") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];