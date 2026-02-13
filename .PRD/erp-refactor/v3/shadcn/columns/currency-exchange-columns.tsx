"use client";

// Column definitions for Currency Exchange
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { CurrencyExchange } from "../types/currency-exchange.js";

export const currencyExchangeColumns: ColumnDef<CurrencyExchange>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const val = row.getValue("date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "from_currency",
    header: "From Currency",
  },
  {
    accessorKey: "to_currency",
    header: "To Currency",
  },
  {
    accessorKey: "exchange_rate",
    header: "Exchange Rate",
  },
];