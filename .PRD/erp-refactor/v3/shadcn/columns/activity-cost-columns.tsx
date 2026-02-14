"use client";

// Column definitions for Activity Cost
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ActivityCost } from "../types/activity-cost.js";

export const activityCostColumns: ColumnDef<ActivityCost>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "activity_type",
    header: "Activity Type",
  },
];