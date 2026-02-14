"use client";

// Column definitions for Currency Exchange Settings
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { CurrencyExchangeSettings } from "../types/currency-exchange-settings.js";

export const currencyExchangeSettingsColumns: ColumnDef<CurrencyExchangeSettings>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "api_endpoint",
    header: "API Endpoint",
  },
];