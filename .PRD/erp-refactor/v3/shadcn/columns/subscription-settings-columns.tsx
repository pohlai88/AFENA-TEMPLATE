"use client";

// Column definitions for Subscription Settings
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SubscriptionSettings } from "../types/subscription-settings.js";

export const subscriptionSettingsColumns: ColumnDef<SubscriptionSettings>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "grace_period",
    header: "Grace Period",
  },
  {
    accessorKey: "cancel_after_grace",
    header: "Cancel Subscription After Grace Period",
    cell: ({ row }) => row.getValue("cancel_after_grace") ? "Yes" : "No",
  },
  {
    accessorKey: "prorate",
    header: "Prorate",
    cell: ({ row }) => row.getValue("prorate") ? "Yes" : "No",
  },
];