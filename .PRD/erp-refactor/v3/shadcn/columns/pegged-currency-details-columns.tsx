"use client";

// Column definitions for Pegged Currency Details
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PeggedCurrencyDetails } from "../types/pegged-currency-details.js";

export const peggedCurrencyDetailsColumns: ColumnDef<PeggedCurrencyDetails>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "source_currency",
    header: "Currency",
  },
  {
    accessorKey: "pegged_against",
    header: "Pegged Against",
  },
  {
    accessorKey: "pegged_exchange_rate",
    header: "Exchange Rate",
  },
];