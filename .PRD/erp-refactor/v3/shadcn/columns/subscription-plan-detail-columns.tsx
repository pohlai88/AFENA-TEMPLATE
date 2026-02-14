"use client";

// Column definitions for Subscription Plan Detail
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SubscriptionPlanDetail } from "../types/subscription-plan-detail.js";

export const subscriptionPlanDetailColumns: ColumnDef<SubscriptionPlanDetail>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "plan",
    header: "Plan",
  },
  {
    accessorKey: "qty",
    header: "Quantity",
  },
];