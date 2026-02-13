"use client";

// Column definitions for UAE VAT Settings
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { UaeVatSettings } from "../types/uae-vat-settings.js";

export const uaeVatSettingsColumns: ColumnDef<UaeVatSettings>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
];