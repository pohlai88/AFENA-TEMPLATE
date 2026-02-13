"use client";

// Column definitions for Currency Exchange Settings Details
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { CurrencyExchangeSettingsDetails } from "../types/currency-exchange-settings-details.js";

export const currencyExchangeSettingsDetailsColumns: ColumnDef<CurrencyExchangeSettingsDetails>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "key",
    header: "Key",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
];