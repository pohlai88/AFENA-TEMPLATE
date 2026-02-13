"use client";

// Column definitions for Currency Exchange Settings Result
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { CurrencyExchangeSettingsResult } from "../types/currency-exchange-settings-result.js";

export const currencyExchangeSettingsResultColumns: ColumnDef<CurrencyExchangeSettingsResult>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "key",
    header: "Key",
  },
];