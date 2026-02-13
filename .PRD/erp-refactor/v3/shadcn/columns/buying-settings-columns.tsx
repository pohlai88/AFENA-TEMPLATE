"use client";

// Column definitions for Buying Settings
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { BuyingSettings } from "../types/buying-settings.js";

export const buyingSettingsColumns: ColumnDef<BuyingSettings>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "supp_master_name",
    header: "Supplier Naming By",
  },
  {
    accessorKey: "supplier_group",
    header: "Default Supplier Group",
  },
  {
    accessorKey: "buying_price_list",
    header: "Default Buying Price List",
  },
  {
    accessorKey: "maintain_same_rate_action",
    header: "Action If Same Rate is Not Maintained",
  },
  {
    accessorKey: "role_to_override_stop_action",
    header: "Role Allowed to Override Stop Action",
  },
];