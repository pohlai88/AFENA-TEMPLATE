"use client";

// Column definitions for South Africa VAT Settings
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SouthAfricaVatSettings } from "../types/south-africa-vat-settings.js";

export const southAfricaVatSettingsColumns: ColumnDef<SouthAfricaVatSettings>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
];