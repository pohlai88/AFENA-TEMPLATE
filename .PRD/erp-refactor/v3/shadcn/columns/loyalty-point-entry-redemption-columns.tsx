"use client";

// Column definitions for Loyalty Point Entry Redemption
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { LoyaltyPointEntryRedemption } from "../types/loyalty-point-entry-redemption.js";

export const loyaltyPointEntryRedemptionColumns: ColumnDef<LoyaltyPointEntryRedemption>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "sales_invoice",
    header: "Sales Invoice",
  },
  {
    accessorKey: "redemption_date",
    header: "Redemption Date",
    cell: ({ row }) => {
      const val = row.getValue("redemption_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "redeemed_points",
    header: "Redeemed Points",
  },
];