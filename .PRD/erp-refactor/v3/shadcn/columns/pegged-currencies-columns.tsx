"use client";

// Column definitions for Pegged Currencies
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PeggedCurrencies } from "../types/pegged-currencies.js";

export const peggedCurrenciesColumns: ColumnDef<PeggedCurrencies>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
];