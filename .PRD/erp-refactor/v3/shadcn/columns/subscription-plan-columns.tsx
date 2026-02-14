"use client";

// Column definitions for Subscription Plan
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SubscriptionPlan } from "../types/subscription-plan.js";

export const subscriptionPlanColumns: ColumnDef<SubscriptionPlan>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "plan_name",
    header: "Plan Name",
  },
  {
    accessorKey: "item",
    header: "Item",
  },
  {
    accessorKey: "cost",
    header: "Cost",
    cell: ({ row }) => {
      const val = row.getValue("cost") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "billing_interval",
    header: "Billing Interval",
  },
];