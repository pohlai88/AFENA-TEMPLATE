"use client";

// Column definitions for Selling Settings
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SellingSettings } from "../types/selling-settings.js";

export const sellingSettingsColumns: ColumnDef<SellingSettings>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "cust_master_name",
    header: "Customer Naming By",
  },
  {
    accessorKey: "customer_group",
    header: "Default Customer Group",
  },
  {
    accessorKey: "territory",
    header: "Default Territory",
  },
  {
    accessorKey: "selling_price_list",
    header: "Default Price List",
  },
];